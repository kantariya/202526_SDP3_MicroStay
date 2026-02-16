package com.microstay.userService.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisVerifyTokenService {

    private final StringRedisTemplate redis;

    public String create(Long userId){
        String token = UUID.randomUUID().toString();
        redis.opsForValue().set("verify:"+token,
                userId.toString(), 24, TimeUnit.HOURS);
        return token;
    }

    public Long get(String token){
        String v = redis.opsForValue().get("verify:"+token);
        return v==null?null:Long.valueOf(v);
    }

    public void delete(String token){
        redis.delete("verify:"+token);
    }
}

