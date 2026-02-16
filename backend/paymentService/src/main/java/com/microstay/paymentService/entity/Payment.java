package com.microstay.paymentService.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    private String paymentGateway; // MOCK
    private String gatewayPaymentId;
    private String gatewayOrderId;

    private Double amount;
    private String currency;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private LocalDateTime paymentTime;

    @Column(name = "booking_id", nullable = false, unique = true)
    private Long bookingId;
}

