package com.corilus.Auth_service.service;

import com.corilus.Auth_service.dto.LoginRequest;
import com.corilus.Auth_service.dto.LoginResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    @Value("${keycloak.server-url}")
    private String keycloakUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    private final RestTemplate restTemplate;

    @Override
    public LoginResponse login(LoginRequest request) {
        validateRequest(request);

        String tokenUrl = buildTokenUrl();
        HttpEntity<MultiValueMap<String, String>> requestEntity = createRequestEntity(request);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    tokenUrl,
                    HttpMethod.POST,
                    requestEntity,
                    Map.class);

            return mapToLoginResponse(response.getBody());

        } catch (HttpClientErrorException e) {
            log.error("Keycloak error: {}", e.getResponseBodyAsString());
            throw new RuntimeException("Authentication failed: " + e.getStatusCode());
        }
    }

    private void validateRequest(LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new IllegalArgumentException("Email and password are required");
        }
    }

    private String buildTokenUrl() {
        return String.format("%s/realms/%s/protocol/openid-connect/token", keycloakUrl, realm);
    }

    private HttpEntity<MultiValueMap<String, String>> createRequestEntity(LoginRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "password");
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("username", request.getEmail());
        body.add("password", request.getPassword());

        return new HttpEntity<>(body, headers);
    }

    private LoginResponse mapToLoginResponse(Map<String, Object> keycloakResponse) {
        return LoginResponse.builder()
                .accessToken((String) keycloakResponse.get("access_token"))
                .refreshToken((String) keycloakResponse.get("refresh_token"))
                .build();
    }
}