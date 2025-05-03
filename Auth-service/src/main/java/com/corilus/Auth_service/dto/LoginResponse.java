package com.corilus.Auth_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private String email;
    private String role;
    private String fullName;
}
