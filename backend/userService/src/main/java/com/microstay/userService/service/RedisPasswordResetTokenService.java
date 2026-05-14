package com.microstay.userService.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisPasswordResetTokenService {

    private final StringRedisTemplate redis;

    public String create(String email) {
        String token = UUID.randomUUID().toString();
        redis.opsForValue().set("pwdreset:" + token, email, 10, TimeUnit.MINUTES);
        log.debug("Password reset token created for email={} expiresInMinutes={}", email, 10);
        return token;
    }

    public String consume(String token) {
        log.debug("Consuming password reset token");
        String key = "pwdreset:" + token;
        String email = redis.opsForValue().get(key);
        if (email != null) {
            redis.delete(key);
            log.info("Password reset token consumed successfully");
        } else {
            log.warn("Password reset token not found or already consumed");
        }
        return email;
    }
}
