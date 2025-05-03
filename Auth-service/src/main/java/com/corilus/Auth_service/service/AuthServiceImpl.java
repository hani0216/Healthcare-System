package com.corilus.Auth_service.service;
import com.corilus.Auth_service.client.UserClient;
import com.corilus.Auth_service.dto.LoginRequest;
import com.corilus.Auth_service.dto.LoginResponse;
import com.corilus.Auth_service.dto.SignupRequest;
import com.corilus.Auth_service.dto.UserInfoResponse;
import com.corilus.Auth_service.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {


    private final UserClient userClient;

    @Value("${keycloak.server-url}")
    private String keycloakUrl;

    @Value("${keycloak.admin-username}")
    private String adminUsername;

    @Value("${keycloak.admin-password}")
    private String adminPassword;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId="master-realm";

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    @Override
    public Map<String, Object> getCurrentUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> userInfo = new HashMap<>();

        userInfo.put("principal", authentication.getPrincipal());
        userInfo.put("authorities", authentication.getAuthorities());
        userInfo.put("name", authentication.getName());
        return userInfo;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        String tokenUrl = keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        Map<String, String> form = new LinkedHashMap<>();
        form.put("grant_type", "password");
        form.put("client_id", clientId);
        form.put("client_secret", clientSecret);
        form.put("username", request.getEmail());
        form.put("password", request.getPassword());

        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(form, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                tokenUrl,
                HttpMethod.POST,
                entity,
                Map.class
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Failed to authenticate with Keycloak");
        }

        Map<String, Object> body = response.getBody();
        String accessToken = (String) body.get("access_token");
        String refreshToken = (String) body.get("refresh_token");

        UserInfoResponse userInfo = userClient.getUserByEmail(request.getEmail());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(userInfo.getEmail())
                .fullName(userInfo.getFullName())
                .role(userInfo.getRole())
                .build();
    }

    @Override
    public void signUp(SignupRequest request) {
        String createUserUrl = keycloakUrl + "/admin/realms/" + realm + "/users";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(getAdminAccessToken());

        Map<String, Object> user = new HashMap<>();
        user.put("username", request.getEmail());
        user.put("email", request.getEmail());
        user.put("enabled", true);
        user.put("firstName", request.getFirstName());
        user.put("lastName", request.getLastName());

        Map<String, Object> credentials = new HashMap<>();
        credentials.put("type", "password");
        credentials.put("value", request.getPassword());
        credentials.put("temporary", false);

        user.put("credentials", List.of(credentials));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(user, headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Void> response = restTemplate.postForEntity(createUserUrl, entity, Void.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Failed to create user in Keycloak");
        }

        // Création de l'utilisateur dans le service de gestion des utilisateurs
        switch (request.getRole().toUpperCase()) {
            case "PATIENT" -> userClient.createPatient(request);
            case "DOCTOR" -> userClient.createDoctor(request);
            case "INSURANCE_ADMIN" -> userClient.createInsuranceAdmin(request);
            default -> throw new IllegalArgumentException("Unknown role: " + request.getRole());
        }
    }

    public String getAdminAccessToken() {
        String tokenUrl = keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        Map<String, String> form = new LinkedHashMap<>();
        form.put("grant_type", "password");
        form.put("client_id", clientId);
        form.put("client_secret", clientSecret);
        form.put("username", adminUsername);
        form.put("password", adminPassword);

        // Convertir le formulaire en MultiValueMap
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        form.forEach(formData::add);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(formData, headers);

        // Créer un RestTemplate avec les convertisseurs appropriés
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(new FormHttpMessageConverter());  // Convertisseur pour l'envoi de données au format formulaire
        restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());  // Convertisseur pour la réponse JSON

        // Effectuer la requête
        ResponseEntity<Map> response = restTemplate.exchange(
                tokenUrl,
                HttpMethod.POST,
                entity,
                Map.class  // Utiliser Map.class pour que RestTemplate parse directement la réponse JSON
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Failed to obtain admin token from Keycloak");
        }

        // Extraire le token d'accès directement de la réponse JSON
        Map<String, Object> body = response.getBody();
        return (String) body.get("access_token");
    }




}