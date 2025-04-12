package com.szcu.mms_profile.Service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.szcu.mms_base.Model.R;
import com.szcu.mms_base.Model.UserFile;
import com.szcu.mms_base.Model.UserProfile;
import io.minio.GetObjectResponse;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserProfileService extends IService<UserProfile> {

	R<String> addUserProfile(UserProfile userProfile);

	R<String> deleteUser(String username);

	R<UserProfile> getUserProfile();

	R<List<UserProfile>> getUserProfiles();

	R<List<UserProfile>> getUserProfilesByPartialRealName(String realName);

	R<List<UserFile>> getFilesByUsername(String username);

	R<List<UserFile>> getFilesByStatus(Integer status);

	R<String> deleteFileByFileId(String id);

	R<String> uploadFile(MultipartFile file);

	ResponseEntity<InputStreamResource> downloadFile(String filename);
}
