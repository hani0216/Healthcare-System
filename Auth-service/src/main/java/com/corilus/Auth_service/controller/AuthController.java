package com.corilus.Auth_service.controller;

import com.corilus.Auth_service.dto.LoginRequest;
import com.corilus.Auth_service.dto.LoginResponse;
import com.corilus.Auth_service.dto.SignupRequest;
import com.corilus.Auth_service.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUserInfo() {
        return ResponseEntity.ok(authService.getCurrentUserInfo());
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        authService.signUp(request);
        return ResponseEntity.ok("User registered successfully");
    }


}
