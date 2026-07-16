package com.microstay.hotelService.repository;

import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.HotelStatus;
import com.microstay.hotelService.entity.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;

import java.util.List;

public interface HotelRepository extends MongoRepository<Hotel, String>,HotelCustomRepository  {

        List<Hotel> findByLocationCityContainingIgnoreCase(String city);

        List<Hotel> findByManagerId(String managerId);

        List<Hotel> findByLocationCityContainingIgnoreCaseAndStatus(String city, HotelStatus status);

        List<Hotel> findByStatus(HotelStatus status);

        long countByStatus(HotelStatus status);

        // 🛠️ ATOMIC OPERATION: Matches by ID and Version, then pushes array changes cleanly
        @Query("{ 'id': ?0 }")
        @Update("{ '$set': { 'rooms': ?1 }, '$inc': { 'version': 1 } }")
        long updateHotelRoomsAndIncrementVersion(String id, List<Room> rooms);

}
