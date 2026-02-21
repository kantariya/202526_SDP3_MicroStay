package com.microstay.paymentService.controller;

import com.microstay.paymentService.entity.Payment;
import com.microstay.paymentService.entity.PaymentStatus;
import com.microstay.paymentService.service.AdminPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
public class AdminPaymentController {

    private final AdminPaymentService adminPaymentService;

    // list payments
    @GetMapping
    public List<Payment> list(
            @RequestParam(required = false) Long bookingId,
            @RequestParam(required = false) PaymentStatus status) {

        return adminPaymentService.list(bookingId, status);
    }

    // payment detail
    @GetMapping("/{id}")
    public Payment getOne(@PathVariable Long id) {
        return adminPaymentService.getOne(id);
    }

    // update payment status
    @PutMapping("/{id}/status")
    public Payment updateStatus(
            @PathVariable Long id,
            @RequestParam PaymentStatus status) {

        return adminPaymentService.updateStatus(id, status);
    }
}