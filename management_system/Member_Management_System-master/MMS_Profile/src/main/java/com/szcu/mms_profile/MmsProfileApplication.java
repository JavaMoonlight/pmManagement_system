package com.szcu.mms_profile;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan(basePackages = {"com.szcu.mms_auth.Mapper", "com.szcu.mms_profile.Mapper"})
public class MmsProfileApplication {

	public static void main(String[] args) {
		SpringApplication.run(MmsProfileApplication.class, args);
	}

}
