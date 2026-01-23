package com.microstay.bookingService.mapper;

import com.microstay.bookingService.dto.InitiateBookingRequest;
import com.microstay.bookingService.entity.Booking;
import com.microstay.contract.hotelContract.dto.AvailabilityRequest;

public class AvailabilityRequestMapper {

    public static AvailabilityRequest fromInitiateRequest(
            InitiateBookingRequest request,
            String roomId,
            Integer roomsRequired
    ) {
        AvailabilityRequest ar = new AvailabilityRequest();
        ar.setHotelId(request.getHotelId());
        ar.setRoomId(roomId);
        ar.setCheckInDate(request.getCheckInDate());
        ar.setCheckOutDate(request.getCheckOutDate());
        ar.setRoomsRequired(roomsRequired);
        return ar;
    }

    public static AvailabilityRequest fromBooking(Booking booking) {
        AvailabilityRequest ar = new AvailabilityRequest();
        ar.setHotelId(booking.getHotelId());
        ar.setRoomId(booking.getRooms().get(0).getRoomId()); // simplified
        ar.setCheckInDate(booking.getCheckInDate());
        ar.setCheckOutDate(booking.getCheckOutDate());
        ar.setRoomsRequired(booking.getTotalRooms());
        return ar;
    }
}
