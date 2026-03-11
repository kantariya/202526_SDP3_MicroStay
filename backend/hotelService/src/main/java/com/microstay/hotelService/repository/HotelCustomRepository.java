package com.microstay.hotelService.repository;

import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.RoomType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface HotelCustomRepository {

    Page<Hotel> searchHotels(
            String city,
            LocalDate checkIn,
            LocalDate checkOut,
            Double minPrice,
            Double maxPrice,
            Integer starRating,
            RoomType roomType,
            List<String> facilities,
            Pageable pageable,
            String sortDirection
    );
}