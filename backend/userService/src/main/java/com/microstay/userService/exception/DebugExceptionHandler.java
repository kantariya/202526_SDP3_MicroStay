package com.microstay.userService.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class DebugExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> debug(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
