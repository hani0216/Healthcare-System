package com.corilus.Auth_service.client;



import com.corilus.Auth_service.dto.SignupRequest;
import com.corilus.Auth_service.dto.UserInfoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-management-service")
public interface UserClient {

    @GetMapping("/api/users/info")
    UserInfoResponse getUserByEmail(@RequestParam("email") String email);

    @PostMapping("/patients")
    void createPatient(SignupRequest request);

    @PostMapping("/doctors")
    void createDoctor(SignupRequest request);

    @PostMapping("/insurance-admins")
    void createInsuranceAdmin(SignupRequest request);

}
