package com.microstay.userService.security;

import com.microstay.userService.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user;

    // ✅ ROLE mapping (CRITICAL)
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );
    }

    // ✅ password from DB
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    // ✅ username = email
    @Override
    public String getUsername() {
        return user.getEmail();
    }

    // ✅ account not expired (simple project = always true)
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // ✅ account not locked (admin can lock later)
    @Override
    public boolean isAccountNonLocked() {
        return !user.isAccountNonLocked();
    }

    // ✅ credentials not expired
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // ✅ enabled flag (ADMIN disable works here)
    @Override
    public boolean isEnabled() {
        return user.isEnabled();
    }

    // optional getter
    public User getUser() {
        return user;
    }
}
