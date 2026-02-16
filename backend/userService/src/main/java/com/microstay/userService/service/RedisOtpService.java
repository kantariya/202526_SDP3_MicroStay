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
        String otp = String.valueOf(new Random().nextInt(900000)+100000);
        redis.opsForValue().set("otp:"+userId, otp, 5, TimeUnit.MINUTES);
        return otp;
    }

    public boolean verify(Long userId,String otp){
        String v = redis.opsForValue().get("otp:"+userId);
        if(v!=null && v.equals(otp)){
            redis.delete("otp:"+userId);
            return true;
        }
        return false;
    }
}

