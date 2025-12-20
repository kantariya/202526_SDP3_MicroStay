package com.microstay.userService.service;

import com.microstay.userService.dto.LoginRequest;
import com.microstay.userService.dto.RegisterRequest;
import com.microstay.userService.entity.Role;
import com.microstay.userService.entity.User;
import com.microstay.userService.repository.UserRepository;
import com.microstay.userService.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public Map<String, String> register(RegisterRequest request) {
        // Validation check
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        var user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setCountry(request.getCountry());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(Role.USER); // Default to USER. Admins usually created manually via SQL or special endpoint.

        repository.save(user);

        // Generate Token immediately upon registration? Or force login?
        // Let's generate token for better UX
        var jwtToken = jwtUtils.generateToken(user);
        Map<String, String> response = new HashMap<>();
        response.put("token", jwtToken);
        return response;
    }

    public Map<String, String> login(LoginRequest request) {
        // This line does the heavy lifting: checks password, checks if user exists
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();

        var jwtToken = jwtUtils.generateToken(user);
        Map<String, String> response = new HashMap<>();
        response.put("token", jwtToken);
        response.put("role", user.getRole().name()); // Useful for Frontend to know who they are
        return response;
    }
}