package com.corilus.Auth_service.service;

import com.corilus.Auth_service.dto.LoginRequest;
import com.corilus.Auth_service.dto.LoginResponse;
import com.corilus.Auth_service.dto.SignupRequest;
import com.corilus.Auth_service.dto.UserInfoResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    UserInfoResponse signUp(SignupRequest request);
    void logout(String refreshToken);
}