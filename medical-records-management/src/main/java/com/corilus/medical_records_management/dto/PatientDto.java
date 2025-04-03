package com.corilus.medical_records_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDto {
    private String name;
    private String phone;
    private String email;
    private String password;
    private String address;
    private Date birthDate;
    private Integer cin;
    private Integer insuranceNumber;
    private String insuranceName;
}
