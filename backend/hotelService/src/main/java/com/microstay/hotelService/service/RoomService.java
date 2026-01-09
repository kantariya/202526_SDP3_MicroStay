package com.microstay.hotelService.service;

import com.microstay.hotelService.entity.Room;

public interface RoomService {

    Room addRoom(String hotelId, Room room);

    Room updateRoom(String hotelId, String roomId, Room room);

    void deleteRoom(String hotelId, String roomId);
}
