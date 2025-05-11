package com.corilus.Auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
