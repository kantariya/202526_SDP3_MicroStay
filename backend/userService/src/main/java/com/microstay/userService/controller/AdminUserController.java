package com.microstay.userService.controller;

import com.microstay.userService.entity.User;
import com.microstay.userService.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping("/users")
    public List<User> listUsers() {
        return adminUserService.listUsers();
    }

    @GetMapping("/users/{id}")
    public User getUser(@PathVariable String id) {
        return adminUserService.getUser(id);
    }

    @PutMapping("/users/{id}/disable")
    public User disableUser(@PathVariable String id) {
        return adminUserService.disableUser(id);
    }

    @PostMapping("/users/{id}/reset-password")
    public String resetPassword(@PathVariable String id) {
        return adminUserService.resetPassword(id);
    }
}