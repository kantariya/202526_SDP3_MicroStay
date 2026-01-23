package com.microstay.hotelService.service;

import com.microstay.contract.hotelContract.dto.AvailabilityRequest;
import com.microstay.contract.hotelContract.dto.AvailabilityResponse;
import com.microstay.contract.hotelContract.dto.ConfirmBookingRequest;
import com.microstay.hotelService.dto.HotelCardResponse;
import com.microstay.hotelService.entity.Hotel;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface HotelService {

    List<HotelCardResponse> getHotelCards(String city);

    Hotel getHotelDetails(String hotelId);

    Hotel createHotel(Hotel hotel);

    Hotel updateHotel(String hotelId, Hotel hotel);

    void deleteHotel(String hotelId);

    AvailabilityResponse checkAvailability(AvailabilityRequest request);

    AvailabilityResponse confirmBooking(ConfirmBookingRequest request);

    @Transactional
    void releaseBooking(ConfirmBookingRequest request);
}
