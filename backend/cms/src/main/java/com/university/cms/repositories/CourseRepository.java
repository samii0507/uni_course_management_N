package com.university.cms.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.university.cms.entities.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCode(String code);

    @Query("""
           select c from Course c
           where lower(c.title) like lower(concat('%', :q, '%'))
              or lower(c.code)  like lower(concat('%', :q, '%'))
           """)
    Page<Course> search(String q, Pageable pageable);
}
