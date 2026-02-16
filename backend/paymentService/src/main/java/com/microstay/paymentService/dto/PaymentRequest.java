package com.microstay.paymentService.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotNull
    private Long bookingId;

    @NotNull
    @DecimalMin(value = "0.01", message = "amount must be greater than 0")
    private Double amount;

    @NotBlank
    @Pattern(regexp = "^[A-Z]{3}$", message = "currency must be a 3-letter ISO code (e.g. INR)")
    private String currency;

    @NotBlank
    @Pattern(regexp = "^(MOCK)$", message = "paymentGateway must be MOCK")
    private String paymentGateway; // MOCK

    @NotBlank
    @Pattern(regexp = "^(SUCCESS|FAILED)$", message = "mockResult must be SUCCESS or FAILED")
    private String mockResult; // SUCCESS / FAILED
}

