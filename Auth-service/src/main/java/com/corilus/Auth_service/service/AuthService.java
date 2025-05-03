package com.corilus.Auth_service.service;

import com.corilus.Auth_service.dto.LoginRequest;
import com.corilus.Auth_service.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}