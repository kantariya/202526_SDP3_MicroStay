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
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        return ResponseEntity.ok(paymentService.createMockPayment(request, userId));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> getById(
            @PathVariable Long paymentId,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        return ResponseEntity.ok(paymentService.getById(paymentId, userId));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponse> getByBookingId(
            @PathVariable Long bookingId,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        return ResponseEntity.ok(paymentService.getByBookingId(bookingId, userId));
    }

    @GetMapping("/my-payments")
    public ResponseEntity<java.util.List<PaymentResponse>> myPayments(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(paymentService.getPaymentsForUser(userId));
    }

    @GetMapping("/manager-payments")
    public ResponseEntity<java.util.List<PaymentResponse>> managerPayments(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(paymentService.getPaymentsForManager(userId));
    }
}
