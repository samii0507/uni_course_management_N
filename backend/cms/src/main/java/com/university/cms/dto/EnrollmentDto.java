package com.university.cms.dto;

import java.time.LocalDateTime;

public record EnrollmentDto(
        Long id,
        Long studentId,
        String studentUsername,
        Long courseId,
        String courseCode,
        String courseTitle,
        LocalDateTime enrolledAt,
        String grade,
        Double marks
) {}
