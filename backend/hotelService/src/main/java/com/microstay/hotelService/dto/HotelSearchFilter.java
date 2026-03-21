package com.microstay.hotelService.dto;

import java.time.LocalDate;
import java.util.List;

import com.microstay.hotelService.entity.RoomType;

import lombok.Data;

@Data
public class HotelSearchFilter {

    // --- Hotel Basic Info ---
    private String city;
    private Integer starRating;
    private String brand;
    private String hotelName;

    // --- Price Filters ---
    private Double priceUnder;
    private Double priceAbove;

    // --- Room Filters ---
    private RoomType roomType;

    private Integer adults;
    private Integer children;
    private Integer totalGuests;

    // --- Facilities / Amenities ---
    private List<String> facilities;
    private List<String> amenities;

    // --- Date Filters ---
    private LocalDate date;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    // --- Rating Filters ---
    private Double minRating;
    private Double maxRating;

    // --- Policy Filters ---
    private Boolean petsAllowed;
    private Boolean smokingAllowed;
    private String cancellationPolicy;

    // --- Sorting ---
    private String sort;

    // --- Location Filters ---
    private Double distanceKm;
}