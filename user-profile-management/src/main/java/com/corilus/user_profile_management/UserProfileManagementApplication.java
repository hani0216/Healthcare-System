package com.corilus.user_profile_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;


@SpringBootApplication
@EnableFeignClients

public class UserProfileManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserProfileManagementApplication.class, args);
	}

}
