package com.corilus.Auth_service.service;

import com.corilus.Auth_service.client.UserClient;
import com.corilus.Auth_service.dto.*;
import feign.FeignException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import com.corilus.Auth_service.mapper.UserProfileMapper;

import java.util.*;

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

    @Value("${keycloak.admin-username}")
    private String adminUsername;

    @Value("${keycloak.admin-password}")
    private String adminPassword;

    private final RestTemplate restTemplate;
    private final UserClient userClient;
    private final UserProfileMapper mapper;

    @Override
    public LoginResponse login(LoginRequest request) {
        validateLoginRequest(request);

        String tokenUrl = buildTokenUrl();
        HttpEntity<MultiValueMap<String, String>> requestEntity = createLoginRequestEntity(request);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    tokenUrl,
                    HttpMethod.POST,
                    requestEntity,
                    Map.class);

            return LoginResponse.builder()
                    .accessToken((String) response.getBody().get("access_token"))
                    .refreshToken((String) response.getBody().get("refresh_token"))
                    .email(request.getEmail())
                    .build();

        } catch (HttpClientErrorException e) {
            log.error("Keycloak login error: {}", e.getResponseBodyAsString());
            throw new RuntimeException("Authentication failed: " + e.getStatusCode());
        }
    }

    @Override
    public UserInfoResponse signUp(SignupRequest request) {
        validateSignupRequest(request);
        String email = request.getEmail();
        String name = request.getFirstName() + " " + request.getLastName();
        String role = request.getRole().toUpperCase();

        // 1. Création dans Keycloak
        String keycloakUserId = createKeycloakUser(request);
        log.info("User created in Keycloak with ID: {}", keycloakUserId);

        try {
            // 2. Assigner le rôle dans Keycloak
            assignRoleToUser(keycloakUserId, role);
            log.info("Role {} assigned to user in Keycloak", role);

            // 3. Créer l'utilisateur dans la base de données
            createUserInDatabase(request);

            UserInfoResponse response = new UserInfoResponse();
            response.setEmail(request.getEmail());
            response.setFullName(name);
            response.setRole(role);

            return response;

        } catch (Exception e) {
            log.error("Database creation failed, rolling back Keycloak user");
            deleteKeycloakUser(keycloakUserId);
            throw new RuntimeException("User creation failed: " + e.getMessage());
        }
    }

    @Override
    public void logout(String refreshToken) {
        String logoutUrl = keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/logout";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("refresh_token", refreshToken);

        try {
            restTemplate.exchange(
                logoutUrl,
                HttpMethod.POST,
                new HttpEntity<>(body, headers),
                Void.class
            );
            log.info("User logged out successfully");
        } catch (Exception e) {
            log.error("Logout failed: {}", e.getMessage());
            throw new RuntimeException("Logout failed");
        }
    }

    private void assignRoleToUser(String userId, String role) {
        String adminToken = getAdminToken();
        String roleUrl = keycloakUrl + "/admin/realms/" + realm + "/roles/" + role;
        String userRolesUrl = keycloakUrl + "/admin/realms/" + realm + "/users/" + userId + "/role-mappings/realm";

        // 1. Récupérer le rôle
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(adminToken);

        ResponseEntity<Map> roleResponse = restTemplate.exchange(
            roleUrl,
            HttpMethod.GET,
            new HttpEntity<>(headers),
            Map.class
        );

        if (roleResponse.getStatusCode() != HttpStatus.OK) {
            throw new RuntimeException("Failed to get role: " + role);
        }

        // 2. Assigner le rôle à l'utilisateur
        List<Map<String, Object>> roles = Collections.singletonList(roleResponse.getBody());
        restTemplate.exchange(
            userRolesUrl,
            HttpMethod.POST,
            new HttpEntity<>(roles, headers),
            Void.class
        );
    }

    private void createUserInDatabase(SignupRequest request) {
        SignupRequest userRequest = new SignupRequest();
        userRequest.setFirstName(request.getFirstName());
        userRequest.setLastName(request.getLastName());
        userRequest.setEmail(request.getEmail());
        userRequest.setPassword(request.getPassword());
        userRequest.setRole(request.getRole());

        try {
            switch (request.getRole().toUpperCase()) {
                case "PATIENT":
                    PatientDto patientDto = mapper.toPatientDto(userRequest);
                    userClient.createPatient(patientDto);
                    break;
                case "DOCTOR":
                    DoctorDto doctorDto = mapper.toDoctorDto(userRequest);
                    userClient.createDoctor(doctorDto);
                    break;
                case "INSURANCE_ADMIN":
                    InsuranceAdminDto insuranceAdminDto = mapper.toInsuranceAdminDto(userRequest);
                    userClient.createInsuranceAdmin(insuranceAdminDto);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid role: " + request.getRole());
            }
        } catch (FeignException e) {
            log.error("Database creation error: {}", e.contentUTF8());
            throw new RuntimeException("Failed to create user in database: " + e.contentUTF8());
        }
    }

    private void deleteKeycloakUser(String userId) {
        try {
            String deleteUrl = keycloakUrl + "/admin/realms/" + realm + "/users/" + userId;
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(getAdminToken());

            restTemplate.exchange(
                    deleteUrl,
                    HttpMethod.DELETE,
                    new HttpEntity<>(headers),
                    Void.class
            );
        } catch (Exception e) {
            log.error("Failed to delete Keycloak user during rollback: {}", e.getMessage());
        }
    }

    private void validateLoginRequest(LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new IllegalArgumentException("Email and password are required");
        }
    }

    private void validateSignupRequest(SignupRequest request) {
        if (request.getEmail() == null || request.getPassword() == null ||
                request.getFirstName() == null || request.getLastName() == null ||
                request.getRole() == null) {
            throw new IllegalArgumentException("All fields are required");
        }
    }

    private String buildTokenUrl() {
        return String.format("%s/realms/%s/protocol/openid-connect/token", keycloakUrl, realm);
    }

    private HttpEntity<MultiValueMap<String, String>> createLoginRequestEntity(LoginRequest request) {
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

    private String createKeycloakUser(SignupRequest request) {
        String adminToken = getAdminToken();
        String createUserUrl = keycloakUrl + "/admin/realms/" + realm + "/users";

        Map<String, Object> user = new HashMap<>();
        user.put("username", request.getEmail());
        user.put("email", request.getEmail());
        user.put("enabled", true);
        user.put("firstName", request.getFirstName());
        user.put("lastName", request.getLastName());
        user.put("attributes", Map.of(
                "role", Collections.singletonList(request.getRole())
        ));

        Map<String, Object> credentials = new HashMap<>();
        credentials.put("type", "password");
        credentials.put("value", request.getPassword());
        credentials.put("temporary", false);

        user.put("credentials", List.of(credentials));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(adminToken);

        ResponseEntity<Void> response = restTemplate.exchange(
                createUserUrl,
                HttpMethod.POST,
                new HttpEntity<>(user, headers),
                Void.class
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Failed to create user in Keycloak. Status: " + response.getStatusCode());
        }

        return getKeycloakUserId(request.getEmail(), adminToken);
    }

    private String getAdminToken() {
        String tokenUrl = keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/token";

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "password");
        formData.add("client_id", clientId);
        formData.add("client_secret", clientSecret);
        formData.add("username", adminUsername);
        formData.add("password", adminPassword);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        ResponseEntity<Map> response = restTemplate.exchange(
                tokenUrl,
                HttpMethod.POST,
                new HttpEntity<>(formData, headers),
                Map.class
        );

        return (String) response.getBody().get("access_token");
    }

    private String getKeycloakUserId(String email, String adminToken) {
        String searchUrl = keycloakUrl + "/admin/realms/" + realm + "/users?email=" + email;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(adminToken);

        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                searchUrl,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                new ParameterizedTypeReference<>() {}
        );

        if (response.getBody() == null || response.getBody().isEmpty()) {
            throw new RuntimeException("User not found after creation");
        }

        return (String) response.getBody().get(0).get("id");
    }

    @Data
    @AllArgsConstructor
    private static class UserCreationRequest {
        private String name;
        private String email;
        private String password;
    }
}