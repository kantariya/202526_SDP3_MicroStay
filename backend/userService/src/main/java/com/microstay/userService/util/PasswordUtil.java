package com.microstay.userService.util;

import java.security.SecureRandom;

public class PasswordUtil {

    private static final String ALL =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!%*?&";

    private static final SecureRandom random = new SecureRandom();

    public static String generateTempPassword(int len) {
        StringBuilder sb = new StringBuilder();
        for(int i=0;i<len;i++) {
            sb.append(ALL.charAt(random.nextInt(ALL.length())));
        }
        return sb.toString();
    }
}
