package com.szcu.mms_base.Model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserPnp {  //用户奖惩信息记录

	int id;

	String username;

	String type;

	String name;

	String description;

	LocalDate time;

	String note;

	LocalDateTime createTime;

	LocalDateTime updateTime;
}
