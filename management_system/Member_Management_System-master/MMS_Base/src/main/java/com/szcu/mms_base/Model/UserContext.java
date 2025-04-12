package com.szcu.mms_base.Model;

import lombok.Data;

@Data
public class UserContext {

	// 使用 ThreadLocal 存储用户信息
	private static final ThreadLocal<String> userContext = new ThreadLocal<>();

	// 私有构造函数，防止外部实例化
	private UserContext() {}

	public static String getUser() {
		return userContext.get();
	}

	public static void setUser(String username){
		userContext.set(username);
	}

	public static void removeUser() {
		userContext.remove();
	}
}
