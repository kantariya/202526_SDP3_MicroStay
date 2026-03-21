package com.microstay.userService.controller;

import com.microstay.userService.dto.ChangePasswordRequest;
import com.microstay.userService.dto.TwoFactorToggleResponse;
import com.microstay.userService.dto.UserResponse;
import com.microstay.userService.dto.UserUpdateRequest;
import com.microstay.userService.entity.Role;
import com.microstay.userService.entity.User;
import com.microstay.userService.repository.UserRepository;
import com.microstay.userService.service.AuthService;
import com.microstay.userService.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final AuthService authService;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getMyProfile() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserResponse response = UserResponse.builder()
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

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/username")
    public ResponseEntity<String> getUsername(@PathVariable Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String username = user.getFirstName() + " " + user.getLastName();

        return ResponseEntity.ok(username);
    }

    @GetMapping("{userId}/role")
    public ResponseEntity<Role> getUserRole(@PathVariable Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user.getRole());
    }

    @PostMapping("/batch")
    public Map<String, String> getUsernames(@RequestBody Set<String> userIds) {
        return userService.getUsernames(userIds);
    }

    @PatchMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @RequestBody UserUpdateRequest request,
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(userService.updateUserProfile(userId, request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(authService.changePassword(Long.parseLong(userId), request));
    }

    @PatchMapping("/two-factor/toggle")
    public ResponseEntity<TwoFactorToggleResponse> toggleTwoFactor(
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(userService.toggleTwoFactor(userId));
    }

}