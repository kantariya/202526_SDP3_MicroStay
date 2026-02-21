package com.microstay.hotelService.controller;

import com.microstay.hotelService.entity.HotelReview;
import com.microstay.hotelService.service.AdminReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {

    private final AdminReviewService adminReviewService;

    // Admin sees all reviews
    @GetMapping
    public List<HotelReview> list(
            @RequestParam(required = false) String hotelId) {

        return adminReviewService.list(hotelId);
    }

    // Hide review
    @PutMapping("/{id}/hide")
    public HotelReview hide(@PathVariable String id) {
        return adminReviewService.hide(id);
    }

    // Unhide review
    @PutMapping("/{id}/unhide")
    public HotelReview unhide(@PathVariable String id) {
        return adminReviewService.unhide(id);
    }

    // Delete review
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        adminReviewService.delete(id);
    }
}