package com.microstay.userService.service;

import org.springframework.stereotype.Service;

@Service
public class EmailTemplateService {

    public String verifyTemplate(String name, String link) {
        return """
        <html>
        <body style="font-family:Arial">
            <h2>Welcome to MicroStay</h2>
            <p>Hello %s,</p>
            <p>Please verify your email by clicking below:</p>
            <a href="%s"
               style="padding:12px 20px;background:#2e7d32;color:white;
                      text-decoration:none;border-radius:6px">
               Verify Email
            </a>
            <p>This link expires soon.</p>
        </body>
        </html>
        """.formatted(name, link);
    }

    public String otpTemplate(String name, String otp) {
        return """
        <html>
        <body style="font-family:Arial">
            <h2>Login OTP</h2>
            <p>Hello %s,</p>
            <p>Your OTP is:</p>
            <h1>%s</h1>
            <p>Valid for 5 minutes.</p>
        </body>
        </html>
        """.formatted(name, otp);
    }

    public String forgotPasswordOtpTemplate(String name, String otp) {
        return """
        <html>
        <body style="font-family:Arial">
            <h2>Password Reset OTP</h2>
            <p>Hello %s,</p>
            <p>Use this OTP to reset your password:</p>
            <h1>%s</h1>
            <p>Valid for 5 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        </body>
        </html>
        """.formatted(name, otp);
    }

    public String passwordChangedTemplate(String name) {
        return """
        <html>
        <body style="font-family:Arial">
            <h2>Password Changed</h2>
            <p>Hello %s,</p>
            <p>Your MicroStay account password has been changed successfully.</p>
            <p>If this was not you, contact support immediately.</p>
        </body>
        </html>
        """.formatted(name);
    }
}
