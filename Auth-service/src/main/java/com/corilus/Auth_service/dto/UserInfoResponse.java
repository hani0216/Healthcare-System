package com.corilus.Auth_service.dto;


import lombok.Data;

@Data
public class UserInfoResponse {
    private String email;
    private String fullName;
    private String role;
}
