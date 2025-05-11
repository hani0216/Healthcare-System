package com.corilus.Auth_service.dto;

import com.corilus.Auth_service.enums.SPECIALITY;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorDto {
    private String name;
    private String phone;
    private String email;
    private String password;
    private String address;
    private Long medicalLicenseNumber;
    private SPECIALITY speciality;
}
