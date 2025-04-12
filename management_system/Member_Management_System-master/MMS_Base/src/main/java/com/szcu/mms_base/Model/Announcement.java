package com.szcu.mms_base.Model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class Announcement {

	private int id;

	private String title;

	private String content;

	private String attachment;

	private LocalDate publish_time;

	private String publisher;

	private LocalDateTime create_time;

	private LocalDateTime update_time;
}
