package com.szcu.mms_auth.Service.Impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.szcu.mms_auth.Mapper.UserAuthMapper;
import com.szcu.mms_auth.Service.UserAuthService;
import com.szcu.mms_base.Model.R;
import com.szcu.mms_base.Model.UserContext;
import com.szcu.mms_base.Model.UserInfo;
import com.szcu.mms_base.Util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserAuthServiceImpl extends ServiceImpl<UserAuthMapper, UserInfo> implements UserAuthService {

	@Autowired
	UserAuthMapper userAuthMapper;

	@Autowired
	HttpServletRequest httpServletRequest;

	private final BCryptPasswordEncoder bpe = new BCryptPasswordEncoder();
	private final JwtUtil jwt = new JwtUtil();

	@Override
	public R<String> saveUser(UserInfo user) {
		if(!checkIfAdmin(UserContext.getUser())) {
			return R.error(401, "无权注册用户");
		}
		if(userAuthMapper.selectCount(new LambdaQueryWrapper<UserInfo>().eq(UserInfo::getUsername, user.getUsername())) > 0) {
			return R.error(401, "用户名已存在");
		}
		String encryptedPassword = bpe.encode(user.getPassword());
		user.setRole("STUDENT");
		user.setPassword(encryptedPassword);
		user.setCreateTime(LocalDateTime.now());
		user.setUpdateTime(LocalDateTime.now());
		userAuthMapper.insert(user);
		return R.success();
	}

	@Override
	public R<String> login(UserInfo user) {
		LambdaQueryWrapper<UserInfo> lqw = new LambdaQueryWrapper<>();
		lqw = lqw.eq(UserInfo::getUsername, user.getUsername());
		UserInfo retUser = userAuthMapper.selectOne(lqw);
		if(bpe.matches(user.getPassword(), retUser.getPassword())){
			Map<String, Object> claims = new HashMap<>();
			claims.put("username", user.getUsername());
			claims.put("password", user.getPassword());
			return R.success(jwt.GenerateJwt(claims));
		}
		return R.error(401, "账号或密码不正确");
	}

	@Override
	public R<String> updatePassword(UserInfo user){
		String username = UserContext.getUser();
		UserInfo login_user = userAuthMapper.selectOne(new LambdaQueryWrapper<UserInfo>().eq(UserInfo::getUsername, username));
		if(!bpe.matches(user.getOldPassword(), login_user.getPassword())) {
			return R.error(401, "原密码错误");
		}
		user.setPassword(bpe.encode(user.getPassword()));
		user.setUpdateTime(LocalDateTime.now());
		LambdaQueryWrapper<UserInfo> lqw = new LambdaQueryWrapper<>();
		lqw = lqw.eq(UserInfo::getUsername, username);
		userAuthMapper.update(user, lqw);
		return R.success();
	}

	@Override
	public R<String> deleteUser(List<String> usernames){
		if(!checkIfAdmin(UserContext.getUser())) {
			return R.error("无权进行此操作");
		}
		for(String username : usernames){
			LambdaQueryWrapper<UserInfo> lqw = new LambdaQueryWrapper<>();
			lqw = lqw.eq(UserInfo::getUsername, username);
			userAuthMapper.delete(lqw);
		}
		return R.success();
	}

	private boolean checkIfAdmin(String username){
		LambdaQueryWrapper<UserInfo> lqw = new LambdaQueryWrapper<>();
		lqw = lqw.eq(UserInfo::getUsername, username);
		UserInfo user = userAuthMapper.selectOne(lqw);
		return "ADMIN".equals(user.getRole());
	}
}
