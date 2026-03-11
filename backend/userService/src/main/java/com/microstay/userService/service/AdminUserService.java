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

    // disable user
    public User disableUser(String id) {
        User u = getUser(id);
        u.SetEnabled(false);
        return userRepository.save(u);
    }

    public User enableUser(String id) {
        User u = getUser(id);
        u.SetEnabled(true);
        return userRepository.save(u);
    }

    // reset password
    public String resetPassword(String id) {

        User u = getUser(id);

        String temp = PasswordUtil.generateTempPassword(12);

        u.setPassword(passwordEncoder.encode(temp));
        userRepository.save(u);

        String html = """
        <h2>Password Updated</h2>
        <p>Hello %s,</p>

        <p>Your password has been updated by Admin.</p>

        <p><b>Email:</b> %s</p>
        <p><b>Temporary Password:</b> %s</p>

        <p>Please login and change your password immediately.</p>

        <br>
        <p>MicroStay Team</p>
        """.formatted(u.getFirstName(), u.getEmail(), temp);

        emailService.sendManagerCredentialsEmail(
                u.getEmail(),
                "Password Updated by Admin",
                html
        );

        return "Password reset and emailed";
    }

    public String changeRole(String id, Role newRole) {

        if(newRole == Role.ADMIN || newRole==Role.USER) {
            return "Cannot assign ADMIN or USERx role through this endpoint";
        }

        User user = getUser(id);

        Role oldRole = user.getRole();

        if (oldRole == newRole) {
            return "User already has role: " + newRole;
        }

        user.setRole(newRole);
        userRepository.save(user);

        String html = """
        <h2>Role Updated</h2>
        <p>Hello %s,</p>

        <p>Your account role has been updated by Admin.</p>

        <p><b>Previous Role:</b> %s</p>
        <p><b>New Role:</b> %s</p>

        <br>
        <p>If you have any questions, contact support.</p>

        <br>
        <p>MicroStay Team</p>
        """.formatted(
                user.getFirstName(),
                oldRole,
                newRole
        );

        emailService.sendManagerCredentialsEmail(
                user.getEmail(),
                "Role Updated by Admin",
                html
        );

        return "User role updated successfully";
    }
}