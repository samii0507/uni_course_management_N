package com.university.cms.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(
  name = "enrollments",
  uniqueConstraints = @UniqueConstraint(
    name = "uk_enrollment_student_course",
    columnNames = {"student_id", "course_id"}
  )
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Enrollment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "student_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_enrollment_student"))
  private User student;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "course_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_enrollment_course"))
  private Course course;

  @Column(nullable = false)
  private LocalDateTime enrolledAt = LocalDateTime.now();

  @OneToOne(mappedBy = "enrollment", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private Result result;
}
