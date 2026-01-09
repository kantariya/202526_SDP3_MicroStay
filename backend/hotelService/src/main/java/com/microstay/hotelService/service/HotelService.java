package com.microstay.hotelService.service;

import com.microstay.hotelService.dto.HotelCardResponse;
import com.microstay.hotelService.entity.Hotel;

import java.util.List;

public interface HotelService {

    List<HotelCardResponse> getHotelCards(String city);

    Hotel getHotelDetails(String hotelId);

    Hotel createHotel(Hotel hotel);

    Hotel updateHotel(String hotelId, Hotel hotel);

    void deleteHotel(String hotelId);
}
