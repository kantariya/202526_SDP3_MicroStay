package com.microstay.paymentService.dto;

import com.microstay.paymentService.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {
    private Long paymentId;
    private Long bookingId;

    private String paymentGateway;
    private String gatewayPaymentId;
    private String gatewayOrderId;

    private Double amount;
    private String currency;
    private PaymentStatus status;
    private LocalDateTime paymentTime;
}

