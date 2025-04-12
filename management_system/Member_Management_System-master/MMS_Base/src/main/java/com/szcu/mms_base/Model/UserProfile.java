package com.szcu.mms_base.Model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserProfile {

	private String username;

	private String realName;

	private String gender;

	private String profilePhoto;

	private String department;

	private LocalDate birthday;

	private String status;

	private LocalDateTime createTime;

	private LocalDateTime updateTime;
}
