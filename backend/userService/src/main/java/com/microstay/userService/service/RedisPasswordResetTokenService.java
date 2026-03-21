package com.microstay.userService.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisPasswordResetTokenService {

    private final StringRedisTemplate redis;

    public String create(String email) {
        String token = UUID.randomUUID().toString();
        redis.opsForValue().set("pwdreset:" + token, email, 10, TimeUnit.MINUTES);
        return token;
    }

    public String consume(String token) {
        String key = "pwdreset:" + token;
        String email = redis.opsForValue().get(key);
        if (email != null) {
            redis.delete(key);
        }
        return email;
    }
}

