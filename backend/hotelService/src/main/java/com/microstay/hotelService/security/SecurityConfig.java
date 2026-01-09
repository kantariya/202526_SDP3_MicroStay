package com.microstay.hotelService.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Disable CSRF for REST APIs
                .csrf(csrf -> csrf.disable())

                // Authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Public hotel APIs (used by frontend)
                        .requestMatchers(
                                "/api",
                                "/api/hotels/**"
                        ).permitAll()

                        // Everything else requires authentication
                        // (authentication is done at API Gateway)
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}
