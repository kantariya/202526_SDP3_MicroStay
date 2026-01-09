package com.microstay.hotelService.repository;

import com.microstay.hotelService.entity.HotelReview;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends MongoRepository<HotelReview, String> {

    List<HotelReview> findByHotelId(String hotelId);

    Optional<HotelReview> findByIdAndUserId(String id, String userId);
}
