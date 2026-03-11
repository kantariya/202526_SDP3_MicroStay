package com.microstay.hotelService.service;

import com.microstay.contract.hotelContract.dto.AvailabilityRequest;
import com.microstay.contract.hotelContract.dto.AvailabilityResponse;
import com.microstay.contract.hotelContract.dto.ConfirmBookingRequest;
import com.microstay.hotelService.dto.HotelCardResponse;
import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.HotelStatus;
import com.microstay.hotelService.entity.RoomType;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

public interface HotelService {

    public Page<Hotel> searchHotels(
            String city,
            LocalDate checkIn,
            LocalDate checkOut,
            Double minPrice,
            Double maxPrice,
            Integer starRating,
            RoomType roomType,
            List<String> facilities,
            int page,
            int size,
            String sortDirection
    );

    List<HotelCardResponse> getHotelCards(String city);

    List<Hotel> getHotelsByManagerId(String managerId);

    List<Hotel> getAllHotels(String city, HotelStatus status, String managerId); // Admin w/ filters

    public HotelCardResponse getHotelCardById(String hotelId) ;

    Hotel getHotelDetails(String hotelId, boolean includeInactiveRooms);

    List<Hotel> getHotelsByStatus(HotelStatus status);

    Hotel updateHotelStatus(String hotelId, HotelStatus status);

    Hotel createHotel(Hotel hotel, String role, String userId);

    Hotel updateHotel(String hotelId, Hotel hotel);

    void deleteHotel(String hotelId);

    AvailabilityResponse checkAvailability(AvailabilityRequest request);

    AvailabilityResponse confirmBooking(ConfirmBookingRequest request);

    @Transactional
    void releaseBooking(ConfirmBookingRequest request);
}
