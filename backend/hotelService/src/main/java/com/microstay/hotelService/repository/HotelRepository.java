package com.microstay.hotelService.repository;

import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.HotelStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface HotelRepository extends MongoRepository<Hotel, String>,HotelCustomRepository  {

        List<Hotel> findByLocationCityContainingIgnoreCase(String city);

        List<Hotel> findByManagerId(String managerId);

        List<Hotel> findByLocationCityContainingIgnoreCaseAndStatus(String city, HotelStatus status);

        List<Hotel> findByStatus(HotelStatus status);

        long countByStatus(HotelStatus status);

}
