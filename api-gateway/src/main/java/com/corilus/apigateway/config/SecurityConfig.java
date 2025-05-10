package com.corilus.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeExchange(auth -> auth
                // Routes publiques
                .pathMatchers("/api/auth/**").permitAll()
                .pathMatchers("/actuator/**").permitAll()
                
                // Routes protégées par rôle
                .pathMatchers("/doctors/**").hasRole("DOCTOR")
                .pathMatchers("/patients/**").hasAnyRole("ADMIN", "PATIENT")
                
                // Toutes les autres routes nécessitent une authentification
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .jwtAuthenticationConverter(jwtToken -> {
                        Map<String, Object> realmAccess = jwtToken.getClaimAsMap("realm_access");
                        List<String> roles = realmAccess != null ? 
                            (List<String>) realmAccess.get("roles") :
                            List.of();
                        
                        Collection<GrantedAuthority> authorities = roles.stream()
                            .map(role -> "ROLE_" + role)
                            .map(role -> (GrantedAuthority) () -> role)
                            .collect(Collectors.toList());
                        
                        return Mono.just(new org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken(
                            jwtToken, authorities));
                    })
                )
            );
        
        return http.build();
    }
} 