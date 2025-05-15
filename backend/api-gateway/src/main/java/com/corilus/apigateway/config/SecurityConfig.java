package com.corilus.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.adapter.WebHttpHandlerBuilder;
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
    public WebFilter corsFilter() {
        return (exchange, chain) -> {
            exchange.getResponse().getHeaders().add("Access-Control-Allow-Origin", "http://localhost:3000");
            exchange.getResponse().getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponse().getHeaders().add("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
            exchange.getResponse().getHeaders().add("Access-Control-Allow-Credentials", "true");
            exchange.getResponse().getHeaders().add("Access-Control-Max-Age", "3600");

            if (exchange.getRequest().getMethod().name().equals("OPTIONS")) {
                exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.OK);
                return Mono.empty();
            }

            return chain.filter(exchange);
        };
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .cors(cors -> cors.disable()) // Désactiver la configuration CORS par défaut
            .csrf(csrf -> csrf.disable())
            .authorizeExchange(auth -> auth
                // Routes publiques
                .pathMatchers("/api/auth/**").permitAll()
                .pathMatchers("/actuator/**").permitAll()
                
                // Routes protégées par rôle
                .pathMatchers("/doctors/**").hasRole("DOCTOR")
                .pathMatchers("/patients/**").hasAnyRole("ADMIN", "PATIENT")
                .pathMatchers("/api/users/userId/**").permitAll()
                    .pathMatchers("/insurance-admins").permitAll()
                
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