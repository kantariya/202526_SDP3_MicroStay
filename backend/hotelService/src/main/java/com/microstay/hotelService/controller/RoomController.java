package com.microstay.hotelService.controller;

import com.microstay.hotelService.entity.Room;
import com.microstay.hotelService.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hotels/{hotelId}/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<Room> addRoom(
            @PathVariable String hotelId,
            @RequestBody Room room
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(roomService.addRoom(hotelId, room));
    }

    @PutMapping("/{roomId}")
    public ResponseEntity<Room> updateRoom(
            @PathVariable String hotelId,
            @PathVariable String roomId,
            @RequestBody Room room
    ) {
        return ResponseEntity.ok(
                roomService.updateRoom(hotelId, roomId, room)
        );
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(
            @PathVariable String hotelId,
            @PathVariable String roomId
    ) {
        roomService.deleteRoom(hotelId, roomId);
        return ResponseEntity.noContent().build();
    }
}
