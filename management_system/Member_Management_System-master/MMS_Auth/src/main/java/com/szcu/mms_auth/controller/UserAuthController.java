package com.szcu.mms_auth.controller;

import com.szcu.mms_auth.Service.UserAuthService;
import com.szcu.mms_base.Model.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.szcu.mms_base.Model.R;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class UserAuthController {

	@Autowired
	UserAuthService userAuthService;

	@PostMapping("/login")
	public R<String> login(@RequestBody UserInfo user){
		return userAuthService.login(user);
	}

	@PostMapping("/register")
	public R<String> register(@RequestBody UserInfo user){
		return userAuthService.saveUser(user);
	}

	@PostMapping("/update")
	public R<String> update(@RequestBody UserInfo user){
		return userAuthService.updatePassword(user);
	}

	@DeleteMapping("/delete")
	public R<String> delete(@RequestBody List<String> username){
		return userAuthService.deleteUser(username);
	}

}
