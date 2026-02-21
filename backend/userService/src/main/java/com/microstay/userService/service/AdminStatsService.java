package com.microstay.userService.service;

import com.microstay.userService.dto.AdminStatsResponse;
import com.microstay.userService.entity.Role;
import com.microstay.userService.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    public AdminStatsResponse getAdminStats() {

        long totalUsers = userRepository.countByRole(Role.USER);
        long totalManagers = userRepository.countByRole(Role.HOTEL_MANAGER);

        Long hotels = 0L;
        Long pendingHotels = 0L;
        Long bookings = 0L;

        try {
            hotels = restTemplate.getForObject(
                    "http://HOTEL-SERVICE/internal/stats/count",
                    Long.class);
        } catch (Exception e) {
            System.out.println("Hotel service total count failed");
        }

        try {
            pendingHotels = restTemplate.getForObject(
                    "http://HOTEL-SERVICE/internal/stats/count?status=PENDING",
                    Long.class);
        } catch (Exception e) {
            System.out.println("Hotel service pending count failed");
        }

        try {
            bookings = restTemplate.getForObject(
                    "http://BOOKING-SERVICE/internal/stats/count",
                    Long.class);
        } catch (Exception e) {
            System.out.println("Booking service failed");
        }

        return new AdminStatsResponse(
                totalUsers,
                totalManagers,
                hotels != null ? hotels : 0L,
                pendingHotels != null ? pendingHotels : 0L,
                bookings != null ? bookings : 0L);
    }
}