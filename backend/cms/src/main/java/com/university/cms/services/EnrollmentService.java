package com.university.cms.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.university.cms.dto.EnrollmentDto;
import com.university.cms.entities.Course;
import com.university.cms.entities.Enrollment;
import com.university.cms.entities.User;
import com.university.cms.repositories.CourseRepository;
import com.university.cms.repositories.EnrollmentRepository;
import com.university.cms.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    /** Enroll a student and return a DTO */
    @Transactional
    public EnrollmentDto enrollStudent(Long studentId, Long courseId) {
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new IllegalArgumentException("Already enrolled in this course");
        }

        long enrolledCount = enrollmentRepository.countByCourseId(courseId);
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        if (enrolledCount >= course.getCapacity()) {
            throw new IllegalStateException("Course is full");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .enrolledAt(LocalDateTime.now())
                .build();

        Enrollment saved = enrollmentRepository.save(enrollment);
        return toDto(saved);
    }

    public void dropEnrollment(Long enrollmentId) {
        enrollmentRepository.deleteById(enrollmentId);
    }

    /** List enrollments for a student as DTOs (transaction ensures LAZY fields available) */
    @Transactional(readOnly = true)
    public List<EnrollmentDto> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId)
                .stream().map(this::toDto).toList();
    }

    /** List enrollments for a course as DTOs */
    @Transactional(readOnly = true)
    public List<EnrollmentDto> getEnrollmentsByCourse(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId)
                .stream().map(this::toDto).toList();
    }

   private EnrollmentDto toDto(Enrollment e) {
    var r = e.getResult();
    return new EnrollmentDto(
            e.getId(),
            e.getStudent().getId(),
            e.getStudent().getUsername(),
            e.getCourse().getId(),
            e.getCourse().getCode(),
            e.getCourse().getTitle(),
            e.getEnrolledAt(),
            r != null ? r.getGrade() : null,
            r != null && r.getMarks() != null ? r.getMarks().doubleValue() : null
    );
}
}
