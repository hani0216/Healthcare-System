package com.corilus.Auth_service.controller;

import com.corilus.Auth_service.dto.LoginRequest;
import com.corilus.Auth_service.dto.LoginResponse;
import com.corilus.Auth_service.dto.SignupRequest;
import com.corilus.Auth_service.dto.UserInfoResponse;
import com.corilus.Auth_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        log.info("Login attempt for user: {}", request.getEmail());
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Authentication error: {}", e.getMessage());
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<UserInfoResponse> signUp(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signUp(request));
    }
}