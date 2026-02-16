package com.microstay.paymentService.controller;

import com.microstay.paymentService.dto.PaymentRequest;
import com.microstay.paymentService.dto.PaymentResponse;
import com.microstay.paymentService.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Frontend-compatible mock payment endpoint.
     * paymentGateway must be "MOCK" and mockResult must be "SUCCESS" or "FAILED".
     */
    @PostMapping
    public ResponseEntity<PaymentResponse> pay(
            @Valid @RequestBody PaymentRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        return ResponseEntity.ok(paymentService.createMockPayment(request, userId));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> getById(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentService.getById(paymentId));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponse> getByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.getByBookingId(bookingId));
    }
}

