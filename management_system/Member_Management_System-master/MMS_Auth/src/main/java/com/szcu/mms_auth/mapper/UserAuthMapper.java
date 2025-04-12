package com.szcu.mms_auth.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.szcu.mms_base.Model.UserInfo;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserAuthMapper extends BaseMapper<UserInfo> {

}
