package com.szcu.mms_profile.Service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.szcu.mms_base.Model.R;
import com.szcu.mms_base.Model.UserPnp;

import java.util.List;

public interface UserPnpService extends IService<UserPnp> {

	R<String> saveUserPnp(UserPnp userPnP);

	R<String> deleteUserPnp(int id);

	R<List<UserPnp>> getUserPnpByUsername(String username);
}
