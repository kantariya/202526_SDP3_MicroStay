package com.microstay.apiGateway.config;

import com.microstay.apiGateway.util.JwtUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.http.HttpHeaders;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimiterConfig {

    @Bean
    public KeyResolver userKeyResolver(JwtUtils jwtUtils) {
        return exchange -> {
            try {
                // 🔐 JWT-based (if logged in)
                String authHeader = exchange.getRequest()
                        .getHeaders()
                        .getFirst("Authorization");

                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String token = authHeader.substring(7);
                    String userId = jwtUtils.extractUserId(token);
                    if (userId != null) {
                        System.out.println("RateLimiter: Identified user " + userId);
                        return Mono.just("user:" + userId);
                    }
                }

                // 🌐 Try X-Forwarded-For (production)
                String ip = exchange.getRequest()
                        .getHeaders()
                        .getFirst("X-Forwarded-For");

                if (ip != null && !ip.isEmpty()) {
                    System.out.println("RateLimiter: Identified IP " + ip);
                    return Mono.just("ip:" + ip.split(",")[0]); // first IP
                }

                // 🖥️ Fallback → direct client IP (local/dev)
                ip = exchange.getRequest()
                        .getRemoteAddress()
                        .getAddress()
                        .getHostAddress();

                System.out.println("RateLimiter: Fallback IP " + ip);
                return Mono.just("ip:" + ip);

            } catch (Exception e) {
                System.out.println("RateLimiter: Error identifying user/IP - " + e.getMessage());
                return Mono.just("anonymous");
            }
        };
    }
}