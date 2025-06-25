package com.corilus.apigateway.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import reactor.core.publisher.Mono;
import org.springframework.security.core.GrantedAuthority;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers",
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials"
        ));
        configuration.setExposedHeaders(Arrays.asList(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials",
            "Access-Control-Allow-Methods",
            "Access-Control-Allow-Headers"
        ));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeExchange(auth -> auth
                // Routes publiques
                .pathMatchers("/api/auth/**").permitAll()
                .pathMatchers("/actuator/**").permitAll()
                .pathMatchers("/api/users/**").permitAll()
                    .pathMatchers("/doctors/speciality/**").hasAnyRole("DOCTOR","Patient","ADMIN")
                .pathMatchers("/doctors/specialities").permitAll()


                    .pathMatchers("/doctors/{id}").hasAnyRole("DOCTOR" ,"PATIENT" , "INSURANCE_ADMIN","ADMIN")// Permettre l'accès aux spécialités sans authentification
                // Routes protégées par rôle
                .pathMatchers("/doctors/**").hasAnyRole("DOCTOR" , "PATIENT" , "INSURANCE_ADMIN","ADMIN")
                    .pathMatchers("/patients").hasAnyRole("ADMIN", "PATIENT" , "DOCTOR")
                .pathMatchers("/patients/**").hasAnyRole("ADMIN", "PATIENT","DOCTOR")
                    .pathMatchers(HttpMethod.GET, "/insurance-admins").hasAnyRole("INSURANCE_ADMIN", "PATIENT","ADMIN")
                    .pathMatchers("/insurance-admins/**").hasAnyRole("INSURANCE_ADMIN","DOCTOR","ADMIN")

                    .pathMatchers(("/medical-records/**")).hasAnyRole("DOCTOR", "PATIENT","ADMIN")
                    .pathMatchers("/api/notifications/notifications/receiver/**").permitAll()
                    .pathMatchers("/api/notifications/notifications/**").permitAll()

                    .pathMatchers("/api/invoices/**").hasAnyRole("PATIENT" ,"DOCTOR" , "INSURANCE_ADMIN","ADMIN")
                    .pathMatchers("/api/reimbursements/**").hasAnyRole("PATIENT","DOCTOR","INSURANCE_ADMIN","ADMIN")

                    .pathMatchers("api/sharing-messages/**").permitAll()



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