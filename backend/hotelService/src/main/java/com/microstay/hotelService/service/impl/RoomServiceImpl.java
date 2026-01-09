package com.microstay.hotelService.service.impl;

import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.Room;
import com.microstay.hotelService.repository.HotelRepository;
import com.microstay.hotelService.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final HotelRepository hotelRepository;

    @Override
    public Room addRoom(String hotelId, Room room) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
        hotel.getRooms().add(room);
        hotelRepository.save(hotel);
        return room;
    }

    @Override
    public Room updateRoom(String hotelId, String roomId, Room room) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        hotel.getRooms().removeIf(r -> r.getRoomId().equals(roomId));
        hotel.getRooms().add(room);
        hotelRepository.save(hotel);
        return room;
    }

    @Override
    public void deleteRoom(String hotelId, String roomId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        hotel.getRooms().removeIf(r -> r.getRoomId().equals(roomId));
        hotelRepository.save(hotel);
    }
}
