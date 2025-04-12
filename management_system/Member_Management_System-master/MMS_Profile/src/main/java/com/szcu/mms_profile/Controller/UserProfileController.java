package com.szcu.mms_profile.Controller;

import com.szcu.mms_base.Model.UserFile;
import com.szcu.mms_profile.Service.UserProfileService;
import com.szcu.mms_base.Model.R;
import com.szcu.mms_base.Model.UserProfile;
import io.minio.GetObjectResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/profile")
public class UserProfileController {

	@Autowired
	UserProfileService userProfileService;

	@PostMapping("/update")
	public R<String> profileUpdate(@RequestBody UserProfile userProfile){
		return userProfileService.addUserProfile(userProfile);
	}

	@PostMapping("/add")
	public R<String> addNewUser(@RequestBody UserProfile userProfile){
		return userProfileService.addUserProfile(userProfile);
	}

	@PostMapping("/delete/{username}")
	public R<String> deleteUser(@PathVariable String username){
		return userProfileService.deleteUser(username);
	}

	@GetMapping("/get")
	public R<UserProfile> getUserProfile() {
		return userProfileService.getUserProfile();
	}

	@GetMapping("/getAll")
	public R<List<UserProfile>> getAllUserProfile() {
		return userProfileService.getUserProfiles();
	}

	@PostMapping("/upload")
	public R<String> uploadFile(@RequestParam("file") MultipartFile file){
		return userProfileService.uploadFile(file);
	}

	@GetMapping("/download/{filename}")
	public ResponseEntity<InputStreamResource> downloadFile(@PathVariable String filename){
		return userProfileService.downloadFile(filename);
	}

	@GetMapping("/partial")
	public R<List<UserProfile>> getUserProfilePartial(@RequestParam String realName){
		return userProfileService.getUserProfilesByPartialRealName(realName);
	}

	@GetMapping("/files/username")
	public R<List<UserFile>> getUserFilesByUsername(@RequestParam String username){
		return userProfileService.getFilesByUsername(username);
	}

	@GetMapping("/files/status")
	public R<List<UserFile>> getUserFilesByStatus(@RequestParam Integer status){
		return userProfileService.getFilesByStatus(status);
	}

	@DeleteMapping("/files/delete")
	public R<String> deleteFile(@RequestParam String fileId){
		return userProfileService.deleteFileByFileId(fileId);
	}
}
