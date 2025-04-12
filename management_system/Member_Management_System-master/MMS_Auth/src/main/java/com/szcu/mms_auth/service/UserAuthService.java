package com.szcu.mms_auth.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.szcu.mms_base.Model.R;
import com.szcu.mms_base.Model.UserInfo;

import java.util.List;

public interface UserAuthService extends IService<UserInfo> {

	R<String> saveUser(UserInfo user);

	R<String> login(UserInfo user);

	R<String> updatePassword(UserInfo user);

	R<String> deleteUser(List<String> usernames);
}
