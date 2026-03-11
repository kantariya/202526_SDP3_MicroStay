package com.microstay.hotelService.service;

import com.microstay.hotelService.client.UserClient;
import com.microstay.hotelService.dto.ReviewResponse;
import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.HotelReview;
import com.microstay.hotelService.repository.HotelRepository;
import com.microstay.hotelService.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManagerReviewService {

    private final HotelRepository hotelRepository;
    private final ReviewRepository reviewRepository;
    private final UserClient userClient;

    public List<ReviewResponse> myHotelReviews(String managerId) {

        // 1️⃣ Get hotels
        List<String> ownedHotelIds = hotelRepository
                .findByManagerId(managerId)
                .stream()
                .map(Hotel::getId)
                .toList();

        if (ownedHotelIds.isEmpty()) {
            return Collections.emptyList();
        }

        // 2️⃣ Get reviews
        List<HotelReview> reviews =
                reviewRepository.findByHotelIdInAndHiddenFalse(ownedHotelIds);

        // 3️⃣ Collect userIds
        Set<String> userIds = reviews.stream()
                .map(HotelReview::getUserId)
                .collect(Collectors.toSet());

        // 4️⃣ Call User Service once
        Map<String, String> userMap =
                userClient.getUsernames(userIds);

        // 5️⃣ Map to DTO
        return reviews.stream()
                .map(r -> new ReviewResponse(
                        r.getId(),
                        r.getHotelId(),
                        r.getUserId(),
                        userMap.getOrDefault(r.getUserId(), "Unknown User"),
                        r.getRating(),
                        r.getComment(),
                        r.getCreatedAt()
                ))
                .toList();
    }
}