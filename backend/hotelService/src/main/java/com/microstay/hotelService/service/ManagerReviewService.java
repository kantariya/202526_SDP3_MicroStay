package com.microstay.hotelService.service;

import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.HotelReview;
import com.microstay.hotelService.repository.HotelRepository;
import com.microstay.hotelService.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManagerReviewService {

    private final ReviewRepository reviewRepository;
    private final HotelRepository hotelRepository;

    // Reviews for manager-owned hotels
    public List<HotelReview> myHotelReviews(
            List<String> hotelIds,
            String managerId) {

        // ownership validation
        List<Hotel> hotels =
                hotelRepository.findByManagerId(managerId);

        Set<String> ownedHotelIds = hotels.stream()
                .map(Hotel::getId)
                .collect(Collectors.toSet());

        // return only reviews for owned hotels
        return hotelIds.stream()
                .filter(ownedHotelIds::contains)
                .flatMap(hotelId ->
                        reviewRepository
                                .findByHotelIdAndHiddenFalse(hotelId)
                                .stream())
                .toList();
    }
}