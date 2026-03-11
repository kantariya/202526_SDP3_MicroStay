package com.microstay.userService.service;

import com.microstay.userService.dto.CreateManagerRequest;
import com.microstay.userService.entity.Role;
import com.microstay.userService.entity.User;
import com.microstay.userService.repository.UserRepository;
import com.microstay.userService.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public String createManager(CreateManagerRequest req) {

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        String tempPassword = PasswordUtil.generateTempPassword(12);

        User user = new User();
        user.setFirstName(req.getName());
        user.setLastName("MANAGER");
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setRole(Role.HOTEL_MANAGER);

        userRepository.save(user);

        emailService.sendManagerCredentialsEmail(
                user.getEmail(),
                user.getFirstName(),
                tempPassword);

        return "Manager created and email sent";
    }

    public String resetManagerPassword(String id) {

        User user = userRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        if (user.getRole() != Role.HOTEL_MANAGER) {
            throw new RuntimeException("Not a manager");
        }

        String tempPassword = PasswordUtil.generateTempPassword(12);

        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);

        emailService.sendManagerCredentialsEmail(
                user.getEmail(),
                user.getFirstName(),
                tempPassword);

        return "Password reset and emailed";
    }

    public List<User> getAllManagers() {
        return userRepository.findByRole(Role.HOTEL_MANAGER);
    }

    public String disableManager(String id) {
        User user = userRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        if (user.getRole() != Role.HOTEL_MANAGER) {
            throw new RuntimeException("Not a manager");
        }

        user.SetEnabled(false); // uses the field setter defined in User entity
        userRepository.save(user);

        return "Manager disabled successfully";
    }

    public String enableManager(String id) {

        User user = userRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        if (user.getRole() != Role.HOTEL_MANAGER) {
            throw new RuntimeException("Not a manager");
        }

        user.SetEnabled(true);
        userRepository.save(user);

        return "Manager enabled successfully";
    }
}
