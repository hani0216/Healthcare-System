package com.corilus.Auth_service.client;

import com.corilus.Auth_service.dto.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(name = "user-profile-management" , url = "http://user-profile-management:8081" )
public interface UserClient {

    @GetMapping("/api/users/info")
    UserInfoResponse getUserByEmail(@RequestParam("email") String email);

    @PostMapping("/patients")
    ResponseEntity<String> createPatient(PatientDto patientDto);

    @PostMapping("/doctors")
    ResponseEntity<String> createDoctor(DoctorDto doctorDto);

    @PostMapping("/insurance-admins")
    ResponseEntity<String> createInsuranceAdmin(InsuranceAdminDto insuranceAdminDto);

}
