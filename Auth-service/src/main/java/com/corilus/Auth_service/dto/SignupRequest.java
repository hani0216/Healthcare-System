package com.corilus.Auth_service.dto;


import lombok.Data;

@Data
public class SignupRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String role; // ex: PATIENT, DOCTOR, ADMIN
}
