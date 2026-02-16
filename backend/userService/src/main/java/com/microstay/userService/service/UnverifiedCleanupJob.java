package com.microstay.userService.service;

import com.microstay.userService.entity.User;
import com.microstay.userService.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class UnverifiedCleanupJob {

    private final UserRepository repo;

    @Scheduled(cron = "0 0 2 * * *")
    public void cleanup(){

        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);

        List<User> list =
                repo.findByEmailVerifiedFalseAndCreatedAtBefore(cutoff);

        repo.deleteAll(list);
    }
}
