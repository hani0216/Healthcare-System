package com.corilus.medical_records_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MedicalRecordsManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedicalRecordsManagementApplication.class, args);
	}

}
