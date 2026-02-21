package com.microstay.userService.service;

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
public class AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // list managers
    public List<User> listManagers() {
        return userRepository.findByRole(Role.HOTEL_MANAGER);
    }

    // list normal users
    public List<User> listUsers() {
        return userRepository.findByRole(Role.USER);
    }

    // get user by id
    public User getUser(String id) {
        return userRepository.findById(Long.valueOf(id))
                .orElseThrow();
    }

    // disable manager
    public User disableManager(String id) {

        User u = getUser(id);

        if (u.getRole() != Role.HOTEL_MANAGER) {
            throw new RuntimeException("Not a manager");
        }

        u.SetEnabled(false);
        return userRepository.save(u);
    }

    // disable user (or manager)
    public User disableUser(String id) {
        User u = getUser(id);
        u.SetEnabled(false);
        return userRepository.save(u);
    }

    // reset password
    public String resetPassword(String id) {

        User u = getUser(id);

        String temp = PasswordUtil.generateTempPassword(12);

        u.setPassword(passwordEncoder.encode(temp));
        userRepository.save(u);

        emailService.sendManagerCredentialsEmail(
                u.getEmail(),
                u.getFirstName(),
                temp);

        return "Password reset and emailed";
    }
}