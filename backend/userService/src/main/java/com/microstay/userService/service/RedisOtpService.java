package com.microstay.userService.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisOtpService {

    private final StringRedisTemplate redis;

    public String generate(Long userId){
        return generate("login", userId.toString());
    }

    public boolean verify(Long userId,String otp){
        return verify("login", userId.toString(), otp);
    }

    public String generate(String purpose, String subject){
        String otp = String.valueOf(new Random().nextInt(900000)+100000);
        redis.opsForValue().set(buildKey(purpose, subject), otp, 5, TimeUnit.MINUTES);
        return otp;
    }

    public boolean verify(String purpose, String subject, String otp){
        String key = buildKey(purpose, subject);
        String v = redis.opsForValue().get(key);
        if(v!=null && v.equals(otp)){
            redis.delete(key);
            return true;
        }
        return false;
    }

    private String buildKey(String purpose, String subject) {
        return "otp:" + purpose + ":" + subject;
    }
}
