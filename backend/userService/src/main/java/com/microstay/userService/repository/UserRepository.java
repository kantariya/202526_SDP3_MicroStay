package com.microstay.userService.repository;

import com.microstay.userService.entity.Role;
import com.microstay.userService.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByEmailVerifiedFalseAndCreatedAtBefore(LocalDateTime time);
    long countByRole(Role role);
    List<User> findByRole(Role role);
    List<User> findAllByIdIn(Set<Long> ids);
    @org.springframework.data.jpa.repository.Query(value = "SELECT MONTHNAME(created_at) as month, COUNT(*) as count FROM users WHERE YEAR(created_at) = YEAR(CURDATE()) AND role = 'USER' GROUP BY MONTH(created_at), MONTHNAME(created_at) ORDER BY MONTH(created_at)", nativeQuery = true)
    List<Map<String, Object>> findUserGrowthData();
}