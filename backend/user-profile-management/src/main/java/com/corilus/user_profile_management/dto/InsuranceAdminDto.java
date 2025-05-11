package com.corilus.user_profile_management.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceAdminDto {
    private String name;
    private String phone;
    private String email;
    private String password;
    private String address;
    private Long insuranceLicenseNumber;
    private String insuranceCompany;
}
