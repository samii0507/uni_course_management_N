package com.university.cms.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.university.cms.entities.Course;
import com.university.cms.repositories.CourseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course updated) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        course.setCode(updated.getCode());
        course.setTitle(updated.getTitle());
        course.setDescription(updated.getDescription());
        course.setCredits(updated.getCredits());
        course.setCapacity(updated.getCapacity());
        course.setActive(updated.isActive());
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    public Page<Course> searchCourses(String q, Pageable pageable) {
        return courseRepository.search(q, pageable);
    }

    public Iterable<Course> listAllCourses() {
        return courseRepository.findAll();
    }
}
