package com.microstay.apiGateway.filter;

import com.microstay.apiGateway.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class JwtGatewayFilter implements GlobalFilter, Ordered {

    private final JwtUtils jwtUtils;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();
        HttpMethod method = exchange.getRequest().getMethod();

        // ✅ ALWAYS allow CORS preflight
        if (method == HttpMethod.OPTIONS) {
            return chain.filter(exchange);
        }

        // ✅ PUBLIC ENDPOINTS
        if (isPublicEndpoint(path, method)) {
            return chain.filter(exchange);
        }

        // 🔐 JWT REQUIRED BELOW
        String authHeader = exchange.getRequest()
                .getHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);

        if (!jwtUtils.isTokenValid(token)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // ✅ Inject identity headers for downstream services
        String userId = jwtUtils.extractUserId(token);
        String email = jwtUtils.extractEmail(token);
        String role = jwtUtils.extractRole(token);

        ServerWebExchange mutated = exchange.mutate()
                .request(r -> r.headers(h -> {
                    h.set("X-User-Id", userId);
                    h.set("X-User-Email", email);
                    h.set("X-User-Role", role);
                }))
                .build();

        return chain.filter(mutated);
    }

    private boolean isPublicEndpoint(String path, HttpMethod method) {

        // auth
        if (path.startsWith("/api/auth")) return true;

        // hotel browsing
        if (path.startsWith("/api/hotels") && method == HttpMethod.GET) return true;

        // availability check (needed before login sometimes)
        if (path.equals("/api/hotels/check-availability")) return true;

        // hotel reviews read
        if (path.matches("^/api/hotels/.*/reviews$") && method == HttpMethod.GET)
            return true;

        return false;
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
