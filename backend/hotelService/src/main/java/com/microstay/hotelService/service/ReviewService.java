package com.microstay.hotelService.service;

import com.microstay.hotelService.entity.HotelReview;

import java.util.List;

public interface ReviewService {

    List<HotelReview> getReviews(String hotelId);

    HotelReview addReview(String hotelId, String userId, HotelReview review);

    HotelReview updateReview(String reviewId, String userId, HotelReview review);

    void deleteReview(String reviewId, String userId, String role);
}

