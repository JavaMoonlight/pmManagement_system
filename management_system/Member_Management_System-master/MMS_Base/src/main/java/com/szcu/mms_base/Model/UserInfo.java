package com.szcu.mms_base.Model;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserInfo {

	private String username;

	@TableField(exist = false)
	private String oldPassword;

	private String password;

	private String role;

	private LocalDateTime createTime;

	private LocalDateTime updateTime;

}
