package com.szcu.mms_profile.Service.Impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.szcu.mms_profile.Mapper.UserAuthMapper_Profile;
import com.szcu.mms_profile.Mapper.UserPnpMapper;
import com.szcu.mms_profile.Mapper.UserProfileMapper;
import com.szcu.mms_profile.Service.UserPnpService;
import com.szcu.mms_base.Model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserPnpServiceImpl extends ServiceImpl<UserPnpMapper, UserPnp> implements UserPnpService {

	@Autowired
	UserPnpMapper userPnpMapper;

	@Autowired
	UserAuthMapper_Profile userAuthMapper;

	@Autowired
	UserProfileMapper userProfileMapper;

	@Override
	public R<String> saveUserPnp(UserPnp userPnP) {
		if(!checkIsAdminOrTeacher(userPnP.getUsername()))
			return R.error(401, "You are not allowed to do this operation");
		int uid = userPnP.getId();
		LambdaQueryWrapper<UserPnp> lqw = new LambdaQueryWrapper<UserPnp>().eq(UserPnp::getId, uid);
		UserPnp existUserPnp = userPnpMapper.selectOne(lqw);
		if(existUserPnp == null){
			userPnP.setCreateTime(LocalDateTime.now());
			userPnP.setUpdateTime(LocalDateTime.now());
			userPnpMapper.insert(userPnP);
			return R.success();
		}
		userPnP.setUpdateTime(LocalDateTime.now());
		userPnpMapper.update(userPnP, lqw);
		return R.success();
	}

	@Override
	public R<String> deleteUserPnp(int id) {
		LambdaQueryWrapper<UserPnp> lqw = new LambdaQueryWrapper<UserPnp>().eq(UserPnp::getId, id);
		UserPnp userPnp = userPnpMapper.selectOne(lqw);
		if(!checkIsAdminOrTeacher(userPnp.getUsername()))
			return R.error(401, "You are not allowed to do this operation");
		userPnpMapper.delete(lqw);
		return R.success();
	}

	@Override
	public R<List<UserPnp>> getUserPnpByUsername(String username) {
		if (!checkIsAdminOrTeacher(username) && !UserContext.getUser().equals(username))
			return R.error(401, "You are not allowed to do this operation");
		LambdaQueryWrapper<UserPnp> lqw = new LambdaQueryWrapper<UserPnp>().eq(UserPnp::getUsername, username);
		List<UserPnp> userPnP = userPnpMapper.selectList(lqw);
		return R.success(userPnP);
	}

	private boolean checkIsAdminOrTeacher(String username){
		String login_user = UserContext.getUser();
		UserInfo userInfo = userAuthMapper.selectOne(new LambdaQueryWrapper<UserInfo>().eq(UserInfo::getUsername, login_user));
		if(userInfo.getRole().equals("ADMIN"))
			return true;
		else if(userInfo.getRole().equals("TEACHER")){
			UserProfile userProfile = userProfileMapper.selectOne(new LambdaQueryWrapper<UserProfile>().eq(UserProfile::getUsername, username));
			UserProfile loginProfile = userProfileMapper.selectOne(new LambdaQueryWrapper<UserProfile>().eq(UserProfile::getUsername, login_user));
			return userProfile.getDepartment().equals(loginProfile.getDepartment());
		}else{
			return false;
		}
	}
}
