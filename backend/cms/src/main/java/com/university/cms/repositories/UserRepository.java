package com.university.cms.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.university.cms.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
