package com.corilus.api_gateway.Config;

import jakarta.servlet.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Configuration
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");

            if (realmAccess != null && realmAccess.containsKey("roles")) {
                @SuppressWarnings("unchecked")
                List<String> roles = (List<String>) realmAccess.get("roles");

                if (roles == null || roles.isEmpty()) {
                    logger.debug("Aucun rôle trouvé - Attribution du rôle USER par défaut");
                    roles = List.of("USER");
                }

                logger.debug("Rôles extraits du JWT: {}", roles);

                return roles.stream()
                        .map(role -> role.startsWith("ROLE_")
                                ? new SimpleGrantedAuthority(role)
                                : new SimpleGrantedAuthority("ROLE_" + role))
                        .collect(Collectors.toList());
            }

            logger.warn("Aucun rôle trouvé dans 'realm_access'");
            return Collections.emptyList();
        });

        return converter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        logger.info("Configuration de la sécurité pour les endpoints API");

        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/doctors/**").hasRole("DOCTOR")
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth -> oauth
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                        .and()
                        .addFilterAfter(new RolesLoggingFilter(), BearerTokenAuthenticationFilter.class));

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        String jwkUri = "http://localhost:8080/realms/mrecords/protocol/openid-connect/certs";
        logger.info("Configuration du JwtDecoder avec l'URL JWK Set : {}", jwkUri);
        return NimbusJwtDecoder.withJwkSetUri(jwkUri).build();
    }

    private static class RolesLoggingFilter implements Filter {
        @Override
        public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
                throws IOException, ServletException {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getAuthorities() != null) {
                logger.debug("Rôles authentifiés: {}",
                        auth.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .collect(Collectors.toList()));
            }
            chain.doFilter(request, response);
        }
    }
}