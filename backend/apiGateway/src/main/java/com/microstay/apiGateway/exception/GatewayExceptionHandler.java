package com.microstay.apiGateway.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class GatewayExceptionHandler {

    private final ObjectMapper objectMapper;

    public Mono<Void> handleUnauthorized(ServerWebExchange exchange, String message) {
        return writeError(exchange, HttpStatus.UNAUTHORIZED, message != null ? message : "Unauthorized", null);
    }

    public Mono<Void> handleForbidden(ServerWebExchange exchange, String message) {
        return writeError(exchange, HttpStatus.FORBIDDEN, message != null ? message : "Forbidden", null);
    }

    public Mono<Void> handleBadRequest(ServerWebExchange exchange, String message) {
        return writeError(exchange, HttpStatus.BAD_REQUEST, message != null ? message : "Bad Request", null);
    }

    public Mono<Void> handleInternalError(ServerWebExchange exchange, Throwable ex) {
        log.error("Unhandled gateway exception path={} ", exchange.getRequest().getPath(), ex);
        return writeError(exchange, HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", ex.getMessage());
    }

    private Mono<Void> writeError(ServerWebExchange exchange, HttpStatus status, String message, String details) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("path", exchange.getRequest().getPath().value());
        if (details != null && !details.isBlank()) {
            body.put("details", details);
        }

        try {
            byte[] bytes = objectMapper.writeValueAsBytes(body);
            exchange.getResponse().setStatusCode(status);
            exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
            DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);
            return exchange.getResponse().writeWith(Mono.just(buffer));
        } catch (Exception e) {
            log.error("Failed to serialize gateway error response", e);
            exchange.getResponse().setStatusCode(status);
            return exchange.getResponse().setComplete();
        }
    }
}

