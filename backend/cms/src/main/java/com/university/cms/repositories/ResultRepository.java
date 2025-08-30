package com.university.cms.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.university.cms.entities.Result;

public interface ResultRepository extends JpaRepository<Result, Long> {
    Optional<Result> findByEnrollmentId(Long enrollmentId);
    boolean existsByEnrollmentId(Long enrollmentId);
}
