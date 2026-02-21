package com.microstay.hotelService.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static String currentUserId() {
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();
        return auth.getName(); // email/userId from JWT
    }

    public static boolean hasRole(String role) {
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        return auth.getAuthorities()
                .stream()
                .anyMatch(a ->
                        a.getAuthority().equals("ROLE_" + role));
    }

    public static boolean isAdmin() {
        return hasRole("ADMIN");
    }

    public static boolean isManager() {
        return hasRole("HOTEL_MANAGER");
    }
}
