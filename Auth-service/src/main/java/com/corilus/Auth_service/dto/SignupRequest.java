package com.corilus.Auth_service.dto;


import lombok.*;

@Data
@Getter
@Setter
public class SignupRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private String role;
}

