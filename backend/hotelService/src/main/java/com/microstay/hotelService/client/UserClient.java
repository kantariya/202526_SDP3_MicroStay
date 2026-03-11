package com.microstay.hotelService.client;

import com.microstay.hotelService.client.dto.Role;
import com.microstay.hotelService.config.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;
import java.util.Set;

@FeignClient(name = "USERSERVICE",configuration = FeignClientConfig.class)
public interface UserClient {

    @GetMapping("/internal/users/{userId}/role")
    public ResponseEntity<Role> getUserRole(@PathVariable Long userId);

    @PostMapping("/api/users/batch")
    Map<String, String> getUsernames(@RequestBody Set<String> userIds);

}

