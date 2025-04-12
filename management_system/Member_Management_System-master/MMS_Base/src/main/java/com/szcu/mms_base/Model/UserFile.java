package com.szcu.mms_base.Model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserFile {

	String username;

	String fileName;

	String filePath;

	LocalDateTime uploadTime;

	String status;   //审核中 已通过 未通过
}
