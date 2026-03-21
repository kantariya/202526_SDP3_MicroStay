package com.microstay.userService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminStatsResponse {

    private long totalUsers;
    private long totalManagers;
    private long totalHotels;
    private long pendingHotels;
    private long totalBookings;
    private java.util.List<UserGrowthDTO> userGrowth;
}
