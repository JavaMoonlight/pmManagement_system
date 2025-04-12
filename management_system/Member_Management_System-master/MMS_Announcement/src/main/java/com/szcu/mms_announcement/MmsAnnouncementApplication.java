package com.szcu.mms_announcement;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan(basePackages = {"com.szcu.mms_auth.Mapper", "com.szcu.mms_announcement.Mapper"})
public class MmsAnnouncementApplication {

	public static void main(String[] args) {
		SpringApplication.run(MmsAnnouncementApplication.class, args);
	}

}
