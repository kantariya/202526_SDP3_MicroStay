package com.microstay.userService.controller;

import com.microstay.userService.entity.Role;
import com.microstay.userService.entity.User;
import com.microstay.userService.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/internal/users")
@RequiredArgsConstructor
public class InternalUserContoller {

    private final UserRepository userRepository;

    @GetMapping("{userId}/role")
    public ResponseEntity<Role> getUserRole(@PathVariable Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user.getRole());
    }
}
