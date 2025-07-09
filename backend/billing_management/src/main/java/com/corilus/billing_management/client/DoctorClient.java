package com.corilus.billing_management.client;

import com.corilus.billing_management.dto.DoctorDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-profile-management" , url = "http://user-profile-management:8081" )
public interface DoctorClient {

    @GetMapping("/doctors/{id}")
    DoctorDto getDoctorById(@PathVariable("id") Long id);
}
