package com.microstay.userService.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisRateLimitService {

    private final StringRedisTemplate redis;

    public boolean allow(String key, long seconds) {
        Boolean ok = redis.opsForValue()
                .setIfAbsent(key, "1", seconds, TimeUnit.SECONDS);
        return Boolean.TRUE.equals(ok);
    }
}
