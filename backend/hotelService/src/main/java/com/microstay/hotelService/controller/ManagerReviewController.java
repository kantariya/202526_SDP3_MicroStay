package com.microstay.hotelService.controller;

import com.microstay.hotelService.dto.ReviewResponse;
import com.microstay.hotelService.entity.HotelReview;
import com.microstay.hotelService.service.ManagerReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager/reviews")
@RequiredArgsConstructor
public class ManagerReviewController {

        private final ManagerReviewService managerReviewService;

        @GetMapping
        public List<ReviewResponse> myHotelReviews(
                @RequestHeader("X-User-Id") String managerId) {

                return managerReviewService.myHotelReviews(
                        managerId);
        }
}