package com.microstay.userService.controller;

import com.microstay.userService.dto.ChangePasswordRequest;
import com.microstay.userService.dto.ForgotPasswordOtpRequest;
import com.microstay.userService.dto.ForgotPasswordOtpVerifyRequest;
import com.microstay.userService.dto.LoginRequest;
import com.microstay.userService.dto.RegisterRequest;
import com.microstay.userService.dto.ResetPasswordRequest;
import com.microstay.userService.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest r) {
        return ResponseEntity.ok(authService.register(r));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verify(@RequestParam String token) {
        return ResponseEntity.ok(authService.verifyEmail(token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest r) {
        return ResponseEntity.ok(authService.login(r));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestParam("userId") Long userId,
            @RequestParam("otp") String otp) {
        return ResponseEntity.ok(authService.verifyOtp(userId, otp));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerify(@RequestParam String email) {
        return ResponseEntity.ok(authService.resendVerification(email));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestParam Long userId) {
        return ResponseEntity.ok(authService.resendOtp(userId));
    }

    @PostMapping("/forgot-password/request-otp")
    public ResponseEntity<?> requestForgotPasswordOtp(
            @Valid @RequestBody ForgotPasswordOtpRequest request) {
        return ResponseEntity.ok(authService.requestForgotPasswordOtp(request));
    }

    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<?> verifyForgotPasswordOtp(
            @Valid @RequestBody ForgotPasswordOtpVerifyRequest request) {
        return ResponseEntity.ok(authService.verifyForgotPasswordOtp(request));
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPasswordAfterOtp(
            @Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPasswordAfterOtp(request));
    }
}
