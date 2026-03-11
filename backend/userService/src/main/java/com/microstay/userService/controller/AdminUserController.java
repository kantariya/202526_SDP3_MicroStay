package com.microstay.userService.controller;

import com.microstay.userService.entity.Role;
import com.microstay.userService.entity.User;
import com.microstay.userService.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public List<User> listUsers() {
        return adminUserService.listUsers();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable String id) {
        return adminUserService.getUser(id);
    }

    @PutMapping("/{id}/disable")
    public User disableUser(@PathVariable String id) {
        return adminUserService.disableUser(id);
    }

    @PutMapping("/{id}/enable")
    public User enableUser(@PathVariable String id) {
        return adminUserService.enableUser(id);
    }

    @PostMapping("/{id}/reset-password")
    public String resetPassword(@PathVariable String id) {
        return adminUserService.resetPassword(id);
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<String> changeUserRole(
            @PathVariable String id,
            @RequestParam Role role
    ) {
        return ResponseEntity.ok(adminUserService.changeRole(id, role));
    }
}