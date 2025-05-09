package com.corilus.api_gateway.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchange -> exchange
                        // Public endpoints
                        .pathMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .pathMatchers("/api/auth/login").permitAll()

                        //USER_MANAGEMENT
                        .pathMatchers("/doctors").hasAnyRole("DOCTOR", "ROLE_DOCTOR")

                        // BILLING_MANAGEMENT
                        .pathMatchers("/api/invoices/**").hasAnyRole("DOCTOR", "ADMIN")

                        // Default fallback
                        .anyExchange().authenticated()
                )

                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(grantedAuthoritiesConverter()))
                )
                .build();
    }

    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        return NimbusReactiveJwtDecoder.withJwkSetUri(
                "http://localhost:8080/realms/mrecords/protocol/openid-connect/certs"
        ).build();
    }

    private Converter<Jwt, Mono<AbstractAuthenticationToken>> grantedAuthoritiesConverter() {
        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthorityPrefix("ROLE_"); // Le préfixe "ROLE_" est par défaut dans Spring Security
        authoritiesConverter.setAuthoritiesClaimName("realm_access.roles"); // Assurez-vous que cette clé correspond à la structure de votre JWT

        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);

        return jwt -> {
            // Extraction de la partie realm_access
            Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");

            // Log des claims pour vérifier que tout est correctement extrait
            System.out.println("JWT claims: " + jwt.getClaims());

            // Log détaillé pour examiner le claim "realm_access.roles"
            if (realmAccess != null && realmAccess.containsKey("roles")) {
                List<String> roles = (List<String>) realmAccess.get("roles");
                System.out.println("Roles extracted from JWT: " + roles);

                if (roles != null && !roles.isEmpty()) {
                    roles.forEach(role -> System.out.println("Role from JWT: " + role));
                } else {
                    System.out.println("Roles are null or empty in realm_access");
                }
            } else {
                System.out.println("No roles found in realm_access");
            }

            return Mono.justOrEmpty(jwtConverter.convert(jwt));
        };
    }
}
