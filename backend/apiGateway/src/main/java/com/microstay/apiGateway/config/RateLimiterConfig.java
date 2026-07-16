package com.microstay.apiGateway.config;

import com.microstay.apiGateway.util.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Slf4j
@Configuration
public class RateLimiterConfig {

    @Bean
    public KeyResolver userKeyResolver(JwtUtils jwtUtils) {
        return exchange -> {
            try {
                // JWT-based (if logged in)
                String authHeader = exchange.getRequest()
                        .getHeaders()
                        .getFirst("Authorization");

                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String token = authHeader.substring(7);
                    String userId = jwtUtils.extractUserId(token);
                    if (userId != null) {
                        log.debug("Rate limiter identified authenticated user id={}", userId);
                        return Mono.just("user:" + userId);
                    }
                }

                // Try X-Forwarded-For (production)
                String ip = exchange.getRequest()
                        .getHeaders()
                        .getFirst("X-Forwarded-For");

                if (ip != null && !ip.isEmpty()) {
                    String resolvedIp = ip.split(",")[0];
                    log.debug("Rate limiter identified forwarded client ip={}", resolvedIp);
                    return Mono.just("ip:" + resolvedIp);
                }

                // Fallback → direct client IP (local/dev)
                ip = exchange.getRequest()
                        .getRemoteAddress()
                        .getAddress()
                        .getHostAddress();

                log.debug("Rate limiter using fallback client ip={}", ip);
                return Mono.just("ip:" + ip);

            } catch (Exception e) {
                log.warn("Rate limiter could not identify user or IP, falling back to anonymous key", e);
                return Mono.just("anonymous");
            }
        };
    }
}