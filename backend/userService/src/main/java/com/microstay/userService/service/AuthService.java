package com.microstay.userService.service;

import com.microstay.userService.dto.LoginRequest;
import com.microstay.userService.dto.RegisterRequest;
import com.microstay.userService.entity.User;
import com.microstay.userService.repository.UserRepository;
import com.microstay.userService.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtUtils jwt;
    private final AuthenticationManager authManager;
    private final RedisVerifyTokenService verifyTokenService;
    private final RedisOtpService otpService;
    private final EmailService emailService;
    private final RedisRateLimitService rateLimit;
    private final EmailTemplateService templates;

    @Value("${app.base-url}")
    private String baseUrl;

    // ---------- REGISTER ----------
    public Map<String,Object> register(RegisterRequest r){

        String emailAddr = r.getEmail().toLowerCase().trim();

        User user = repo.findByEmail(emailAddr).orElse(null);

        if(user == null){
            user = new User();
            user.setEmail(emailAddr);
        } else if(user.isEmailVerified()){
            throw new RuntimeException("Email already registered");
        }

        user.setPassword(encoder.encode(r.getPassword()));
        user.setFirstName(r.getFirstName());
        user.setLastName(r.getLastName());
        user.setPhone(r.getPhone());
        user.setAddress(r.getAddress());
        user.setCity(r.getCity());
        user.setCountry(r.getCountry());
        user.setEmailVerified(false);

        repo.save(user);

        String token = verifyTokenService.create(user.getId());
        String link = baseUrl + "/api/auth/verify-email?token=" + token;

        String html = templates.verifyTemplate(user.getFirstName(), link);
        emailService.sendHtml(user.getEmail(), "Verify Email", html);

        return Map.of(
                "status","VERIFY_REQUIRED",
                "message","Verification email sent"
        );
    }

    // ---------- VERIFY ----------
    public Map<String,String> verifyEmail(String token){

        Long id = verifyTokenService.get(token);
        if(id == null) throw new RuntimeException("Token expired");

        User u = repo.findById(id).orElseThrow();
        u.setEmailVerified(true);
        repo.save(u);
        verifyTokenService.delete(token);

        return Map.of("status","VERIFIED");
    }

    // ---------- LOGIN ----------
    public Map<String,Object> login(LoginRequest r){

        User u = repo.findByEmail(r.getEmail().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if(!u.isEmailVerified())
            return Map.of("status","VERIFY_REQUIRED");

        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        r.getEmail(), r.getPassword()));

        if(u.isTwoFactorEnabled() && !u.isGoogleUser()){
            String otp = otpService.generate(u.getId());

            String html = templates.otpTemplate(u.getFirstName(), otp);
            emailService.sendHtml(u.getEmail(), "Login OTP", html);

            return Map.of(
                    "status","OTP_REQUIRED",
                    "userId",u.getId()
            );
        }

        return issueJwt(u);
    }

    public Map<String,Object> verifyOtp(Long id,String otp){
        if(!otpService.verify(id,otp))
            throw new RuntimeException("Bad OTP");
        return issueJwt(repo.findById(id).orElseThrow());
    }

    // ---------- RESEND VERIFY ----------
    public Map<String,Object> resendVerification(String email){

        User u = repo.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(u.isEmailVerified())
            return Map.of("status","ALREADY_VERIFIED");

        if(!rateLimit.allow("resend:verify:"+u.getId(),60))
            return Map.of("status","WAIT","seconds",60);

        String token = verifyTokenService.create(u.getId());
        String link = baseUrl+"/api/auth/verify-email?token="+token;

        String html = templates.verifyTemplate(u.getFirstName(), link);
        emailService.sendHtml(u.getEmail(),"Verify Email",html);

        return Map.of("status","SENT");
    }

    // ---------- RESEND OTP ----------
    public Map<String,Object> resendOtp(Long userId){

        User u = repo.findById(userId).orElseThrow();

        if(!rateLimit.allow("resend:otp:"+userId,60))
            return Map.of("status","WAIT","seconds",60);

        String otp = otpService.generate(userId);

        String html = templates.otpTemplate(u.getFirstName(), otp);
        emailService.sendHtml(u.getEmail(),"Login OTP",html);

        return Map.of("status","SENT");
    }

    private Map<String,Object> issueJwt(User u){
        return Map.of(
                "status","SUCCESS",
                "token",jwt.generateToken(u),
                "role",u.getRole().name()
        );
    }
}
