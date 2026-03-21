package com.microstay.userService.service;

import com.microstay.userService.dto.RegisterRequest;
import com.microstay.userService.dto.TwoFactorToggleResponse;
import com.microstay.userService.dto.UserResponse;
import com.microstay.userService.dto.UserUpdateRequest;
import com.microstay.userService.entity.Role;
import com.microstay.userService.entity.User;
import com.microstay.userService.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setCountry(request.getCountry());
        user.setRole(Role.USER);

        User savedUser = userRepository.save(user);

        return UserResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .phone(savedUser.getPhone())
                .address(savedUser.getAddress())
                .city(savedUser.getCity())
                .country(savedUser.getCountry())
                .role(savedUser.getRole())
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

    public Map<String, String> getUsernames(Set<String> userIds) {

        // Convert String → Long
        Set<Long> longIds = userIds.stream()
                .map(Long::parseLong)
                .collect(Collectors.toSet());

        List<User> users = userRepository.findAllByIdIn(longIds);

        return users.stream()
                .collect(Collectors.toMap(
                        user -> user.getId().toString(),
                        user -> user.getFirstName() + " " + user.getLastName()
                ));
    }


    public UserResponse updateUserProfile(Long userId, UserUpdateRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }

        if (request.getCity() != null) {
            user.setCity(request.getCity());
        }

        if (request.getCountry() != null) {
            user.setCountry(request.getCountry());
        }

        userRepository.save(user);

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .city(user.getCity())
                .country(user.getCountry())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public TwoFactorToggleResponse toggleTwoFactor(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean updatedTwoFactorState = !user.isTwoFactorEnabled();
        user.setTwoFactorEnabled(updatedTwoFactorState);
        userRepository.save(user);

        return TwoFactorToggleResponse.builder()
                .userId(user.getId())
                .twoFactorEnabled(user.isTwoFactorEnabled())
                .build();
    }

}