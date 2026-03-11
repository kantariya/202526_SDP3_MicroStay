package com.microstay.userService.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // ✅ public endpoints
                        .requestMatchers(
                                "/api/auth/**",
                                "/oauth2/**",
                                "/login/**",
                                "/actuator/**",
                                "/error"
                        ).permitAll()

                        //  internal endpoints for inter-service communication
                        .requestMatchers("/internal/**").permitAll()

                        // ✅ ADMIN only
                        .requestMatchers("/admin/**")
                        .hasRole("ADMIN")

                        // ✅ MANAGER + ADMIN
                                .requestMatchers("/manager/**")
                                .hasAnyRole("ADMIN","HOTEL_MANAGER")

                        // ✅ all others need login
                        .anyRequest().authenticated()
                )

                // Google OAuth
                .oauth2Login(oauth -> oauth
                        .successHandler(oAuth2SuccessHandler)
                )

                // JWT stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
