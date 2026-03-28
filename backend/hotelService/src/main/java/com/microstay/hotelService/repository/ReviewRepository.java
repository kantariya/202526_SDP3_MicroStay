package com.microstay.hotelService.repository;

import com.microstay.hotelService.entity.HotelReview;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends MongoRepository<HotelReview, String> {

    List<HotelReview> findByHotelId(String hotelId);

    List<HotelReview> findByHotelIdAndHiddenFalse(String hotelId);

    Optional<HotelReview> findByHotelIdAndUserId(String hotelId, String userId);

    Optional<HotelReview> findByIdAndUserId(String id, String userId);

    List<HotelReview> findByHotelIdInAndHiddenFalse(List<String> hotelIds);

    boolean existsByUserIdAndHotelId(String userId, String hotelId);

}
