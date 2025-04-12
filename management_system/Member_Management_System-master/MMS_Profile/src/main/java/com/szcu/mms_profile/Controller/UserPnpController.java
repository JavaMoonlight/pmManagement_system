package com.szcu.mms_profile.Controller;

import com.szcu.mms_profile.Service.UserPnpService;
import com.szcu.mms_base.Model.R;
import com.szcu.mms_base.Model.UserPnp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profile/pnp")
public class UserPnpController {

	@Autowired
	UserPnpService userPnpService;

	@PostMapping("/add")
	public R<String> addPnp(@RequestBody UserPnp userPnP) {
		return userPnpService.saveUserPnp(userPnP);
	}

	@PostMapping("/update")
	public R<String> updatePnp(@RequestBody UserPnp userPnP) {
		return userPnpService.saveUserPnp(userPnP);
	}

	@PostMapping("/delete/{id}")
	public R<String> deletePnp(@PathVariable int id){
		return userPnpService.deleteUserPnp(id);
	}

	@GetMapping("/get/{username}")
	public R<List<UserPnp>> getPnpByUsername(@PathVariable String username) {
		return userPnpService.getUserPnpByUsername(username);
	}
}
