package com.microstay.hotelService.repository;

import com.microstay.hotelService.entity.Hotel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface HotelRepository extends MongoRepository<Hotel, String> {

    List<Hotel> findByCityAndActiveTrue(String city);

    List<Hotel> findByAverageRatingGreaterThanEqual(Double rating);
}
