package com.corilus.Auth_service.service;


import com.corilus.Auth_service.dto.LoginRequest;
import com.corilus.Auth_service.dto.LoginResponse;
import com.corilus.Auth_service.dto.SignupRequest;

import java.util.Map;

public interface AuthService {
    Map<String, Object> getCurrentUserInfo();
    LoginResponse login(LoginRequest request);
    void signUp(SignupRequest request) ;

}
