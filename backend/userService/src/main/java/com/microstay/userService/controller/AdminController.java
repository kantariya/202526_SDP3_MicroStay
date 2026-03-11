package com.microstay.userService.controller;

import com.microstay.userService.dto.CreateManagerRequest;
import com.microstay.userService.entity.Role;
import com.microstay.userService.entity.User;
import com.microstay.userService.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/managers")
    public ResponseEntity<?> createManager(
            @RequestBody CreateManagerRequest req) {

        return ResponseEntity.ok(
                adminService.createManager(req));
    }

    @PostMapping("/managers/{id}/reset-password")
    public ResponseEntity<?> resetManagerPassword(
            @PathVariable String id) {

        return ResponseEntity.ok(
                adminService.resetManagerPassword(id));
    }

    // ✅ GET ALL MANAGERS
    @GetMapping("/managers")
    public ResponseEntity<List<User>> getAllManagers() {
        return ResponseEntity.ok(
                adminService.getAllManagers());
    }

    // ✅ DISABLE MANAGER
    @PutMapping("/managers/{id}/disable")
    public ResponseEntity<?> disableManager(@PathVariable String id) {
        return ResponseEntity.ok(
                adminService.disableManager(id));
    }

    @PutMapping("/managers/{id}/enable")
    public ResponseEntity<?> enableManager(@PathVariable String id) {
        return ResponseEntity.ok(
                adminService.enableManager(id));
    }

}
