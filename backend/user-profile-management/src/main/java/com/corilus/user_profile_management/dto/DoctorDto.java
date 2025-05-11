package com.corilus.user_profile_management.dto;

import com.corilus.user_profile_management.enums.SPECIALITY;
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
