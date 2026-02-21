package com.microstay.hotelService.controller;

import com.microstay.hotelService.entity.HotelReview;
import com.microstay.hotelService.service.ManagerReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manager/reviews")
@RequiredArgsConstructor
public class ManagerReviewController {

        private final ManagerReviewService managerReviewService;

        @GetMapping
        public List<HotelReview> myHotelReviews(
                @RequestParam List<String> hotelIds,
                @RequestHeader("X-User-Id") String managerId) {

                return managerReviewService.myHotelReviews(
                        hotelIds,
                        managerId);
        }
}