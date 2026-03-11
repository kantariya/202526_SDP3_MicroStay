package com.microstay.hotelService.service;

import com.microstay.hotelService.entity.Room;

import java.util.List;

public interface RoomService {

    Room addRoom(String hotelId, Room room);

    Room updateRoom(String hotelId, String roomId, Room room);

    void deleteRoom(String hotelId, String roomId);

    public List<Room> getRoomsByHotelId(String hotelId);
}
