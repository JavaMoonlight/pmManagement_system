package com.szcu.mms_profile.Service.Impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.szcu.mms_profile.Mapper.UserAuthMapper_Profile;
import com.szcu.mms_base.Model.*;
import com.szcu.mms_profile.Mapper.UserFileMapper;
import com.szcu.mms_profile.Mapper.UserProfileMapper;
import com.szcu.mms_profile.Service.UserProfileService;
import io.minio.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserProfileServiceImpl extends ServiceImpl<UserProfileMapper, UserProfile> implements UserProfileService{

	@Autowired
	UserProfileMapper userProfileMapper;

	@Autowired
	UserAuthMapper_Profile userAuthMapper;

	@Autowired
	UserFileMapper userFileMapper;

	@Override
	public R<String> addUserProfile(UserProfile userProfile) {
		String username = UserContext.getUser();
		if(!checkIfTeacherOrAdmin(username) && !username.equals(userProfile.getUsername())){
			return R.error(401, "无权修改用户信息");
		}
		LambdaQueryWrapper<UserProfile> lqw = new LambdaQueryWrapper<>();
		lqw.eq(UserProfile::getUsername, userProfile.getUsername());
		if(userProfileMapper.selectOne(lqw) == null) {
			userProfile.setCreateTime(LocalDateTime.now());
			userProfile.setUpdateTime(LocalDateTime.now());
			userProfileMapper.insert(userProfile);
			return R.success();
		}
		userProfile.setUpdateTime(LocalDateTime.now());
		userProfileMapper.update(userProfile, lqw);
		return R.success();
	}

	@Override
	public R<String> deleteUser(String username) {      //只有管理员或老师有权删除用户信息
		if(!checkIfTeacherOrAdmin(UserContext.getUser())){
			return R.error(401, "无权删除用户");
		}
		LambdaQueryWrapper<UserProfile> lqw = new LambdaQueryWrapper<>();
		lqw.eq(UserProfile::getUsername, username);
		userProfileMapper.delete(lqw);
		return R.success();
	}

	@Override
	public R<UserProfile> getUserProfile() {    //面向用户获取个人信息
		String username = UserContext.getUser();
		LambdaQueryWrapper<UserProfile> lqw = new LambdaQueryWrapper<>();
		lqw.eq(UserProfile::getUsername, username);
		UserProfile userProfile = userProfileMapper.selectOne(lqw);
		if(userProfile == null){
			return R.error(404, "用户信息不存在");
		}
		return R.success(userProfile);
	}

	@Override
	public R<List<UserProfile>> getUserProfiles() {     //面向系统管理员和老师获取用户个人信息
		String username = UserContext.getUser();
		LambdaQueryWrapper<UserInfo> lqw = new LambdaQueryWrapper<>();
		lqw.eq(UserInfo::getUsername, username);
		UserInfo userInfo = userAuthMapper.selectOne(lqw);
		if("ADMIN".equals(userInfo.getRole())){
			return R.success(userProfileMapper.selectList(null));
		}else if("TEACHER".equals(userInfo.getRole())){
			LambdaQueryWrapper<UserProfile> lqw1 = new LambdaQueryWrapper<>();
			lqw1.eq(UserProfile::getUsername, username);
			UserProfile userProfile = userProfileMapper.selectOne(lqw1);
			LambdaQueryWrapper<UserProfile> lqw2 = new LambdaQueryWrapper<>();
			lqw2.eq(UserProfile::getDepartment, userProfile.getDepartment());
			return R.success(userProfileMapper.selectList(lqw2));
		}else{
			return R.error(401, "无权查看用户信息");
		}
	}

	@Override
	public R<List<UserProfile>> getUserProfilesByPartialRealName(String realName){

		if(!checkIfTeacherOrAdmin(UserContext.getUser())){
			return R.error(401, "无权查询用户信息");
		}

		LambdaQueryWrapper<UserProfile> lqw = new LambdaQueryWrapper<>();
		lqw.like(UserProfile::getRealName, realName);
		List<UserProfile> userProfiles = userProfileMapper.selectList(lqw);
		return R.success(userProfiles);
	}

	//根据用户名列出用户上传的文件,未完成审核的文件学生可见老师不可见。
	@Override
	public R<List<UserFile>> getFilesByUsername(String username){
		String loginUser = UserContext.getUser();
		if(loginUser.equals(username)) {
			LambdaQueryWrapper<UserFile> lqw = new LambdaQueryWrapper<>();
			lqw.eq(UserFile::getUsername, username);
			List<UserFile> userFiles = userFileMapper.selectList(lqw);
			return R.success(userFiles);
		}
		else if(checkIfTeacherOrAdmin(loginUser)){
			LambdaQueryWrapper<UserFile> lqw = new LambdaQueryWrapper<>();
			lqw.eq(UserFile::getUsername, username)
					.and(userFileLambdaQueryWrapper -> userFileLambdaQueryWrapper.eq(UserFile::getStatus, 1)
							.or().eq(UserFile::getStatus, 2));
			List<UserFile> userFiles = userFileMapper.selectList(lqw);
			return R.success(userFiles);
		}else{
			return R.error("无权进行此操作");
		}
	}

	//筛选文件的状态（0-未审核 1-已通过 2-未通过），文件由管理员审核
	@Override
	public R<List<UserFile>> getFilesByStatus(Integer status){
		String loginUser = UserContext.getUser();
		if(!checkIfAdmin(loginUser)){
			return R.error("无权进行此操作");
		}

		LambdaQueryWrapper<UserFile> lqw = new LambdaQueryWrapper<>();
		lqw.eq(UserFile::getStatus, status);
		List<UserFile> userFiles = userFileMapper.selectList(lqw);
		return R.success(userFiles);
	}

	//文件删除（面向学生）
	@Override
	public R<String> deleteFileByFileId(String id){
		UserFile userFile = userFileMapper.selectById(id);
		if(userFile == null){
			return R.error("该ID不存在对应文件");
		}
		if(!userFile.getUsername().equals(UserContext.getUser())){
			return R.error("无权删除文件");
		}
		String filePath = userFile.getFilePath();
		try {
			MinioClient minioClient = MinioClient.builder()
					.endpoint("http://localhost:9000")
					.credentials("minioadmin", "minioadmin")
					.build();
			minioClient.deleteObjectTags(DeleteObjectTagsArgs.builder().bucket("MMS_UserFiles").object(filePath).build());
		} catch (Exception e) {
			e.printStackTrace();
			return R.error(500, "文件删除失败");
		}
		userFileMapper.deleteById(id);
		return R.success();
	}

	@Override
	public R<String> uploadFile(MultipartFile file) {

		try {
			MinioClient minioClient = MinioClient.builder()
					.endpoint("http://localhost:9000")
					.credentials("minioadmin", "minioadmin")
					.build();

			String filePath = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();

			minioClient.putObject(PutObjectArgs.builder()
					.bucket("MMS_UserFiles") // 替换为你实际的存储桶名称
					.object(filePath)
					.stream(file.getInputStream(), file.getSize(), -1)
					.contentType(file.getContentType())
					.build());

			String username = UserContext.getUser();
			UserFile userFile = new UserFile();
			userFile.setFileName(file.getOriginalFilename());
			userFile.setFilePath(filePath);
			userFile.setUsername(username);
			userFile.setUploadTime(LocalDateTime.now());
			userFileMapper.insert(userFile);

			return R.success("文件上传成功");
		} catch (Exception e) {
			e.printStackTrace();
			return R.error(500, "文件上传失败");
		}
	}

	@Override
	public ResponseEntity<InputStreamResource> downloadFile(String filename) {
		LambdaQueryWrapper<UserFile> lqw = new LambdaQueryWrapper<>();
		lqw.eq(UserFile::getFileName, filename);
		UserFile userFile = userFileMapper.selectOne(lqw);
		if(userFile == null){
			return ResponseEntity.notFound().build();
		}
		if(!checkIfTeacherOrAdmin(UserContext.getUser()) && !UserContext.getUser().equals(userFile.getUsername())){
			return ResponseEntity.status(401).build();
		}
		try{
			MinioClient minioClient = MinioClient.builder()
					.endpoint("http://localhost:9000")
					.credentials("minioadmin", "minioadmin")
					.build();

			GetObjectResponse objectResponse =  minioClient.getObject(GetObjectArgs.builder().bucket("MMS_UserFiles").object(filename).build());

			InputStream inputStream = objectResponse;

			// 设置响应头
			HttpHeaders headers = new HttpHeaders();
			headers.add(HttpHeaders.CONTENT_TYPE, "application/octet-stream");
			headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
			return ResponseEntity.ok()
					.headers(headers)
					.body(new InputStreamResource(inputStream));


		}catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.notFound().build();
		}
	}

	private boolean checkIfTeacherOrAdmin(String username){
		return checkIfTeacher(username) || checkIfAdmin(username);
	}

	private boolean checkIfAdmin(String username){
		LambdaQueryWrapper<UserInfo> lqw = new LambdaQueryWrapper<>();
		lqw.eq(UserInfo::getUsername, username);
		UserInfo userInfo = userAuthMapper.selectOne(lqw);
		String role = userInfo.getRole();
		return "ADMIN".equals(role);
	}

	private boolean checkIfTeacher(String username){
		LambdaQueryWrapper<UserInfo> lqw = new LambdaQueryWrapper<>();
		lqw.eq(UserInfo::getUsername, username);
		UserInfo userInfo = userAuthMapper.selectOne(lqw);
		String role = userInfo.getRole();
		return "TEACHER".equals(role);
	}
}
