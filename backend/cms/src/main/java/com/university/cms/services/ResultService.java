package com.university.cms.services;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.university.cms.entities.Enrollment;
import com.university.cms.entities.Result;
import com.university.cms.repositories.EnrollmentRepository;
import com.university.cms.repositories.ResultRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository resultRepository;
    private final EnrollmentRepository enrollmentRepository;

    public Result updateResult(Long enrollmentId, String grade, Double marks) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new IllegalArgumentException("Enrollment not found"));

        Result result = resultRepository.findByEnrollmentId(enrollmentId)
                .orElse(Result.builder().enrollment(enrollment).build());

        result.setGrade(grade);
        // convert Double -> BigDecimal (handles null safely)
        result.setMarks(marks == null ? null : BigDecimal.valueOf(marks));

        return resultRepository.save(result);
    }

    public Result getResultByEnrollment(Long enrollmentId) {
        return resultRepository.findByEnrollmentId(enrollmentId)
                .orElseThrow(() -> new IllegalArgumentException("Result not found"));
    }
}
