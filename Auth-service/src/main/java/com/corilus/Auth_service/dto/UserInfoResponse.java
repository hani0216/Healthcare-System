package com.corilus.Auth_service.dto;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class UserInfoResponse {
    private String email;
    private String fullName;
    private String role;
}
