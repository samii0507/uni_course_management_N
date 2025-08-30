package com.university.cms.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(
  name = "courses",
  uniqueConstraints = @UniqueConstraint(name = "uk_courses_code", columnNames = "code")
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Course {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Column(nullable = false, length = 20)
  private String code;   // e.g., CS101

  @NotBlank
  @Column(nullable = false, length = 255)
  private String title;  // e.g., Data Structures

  @Column(columnDefinition = "text")
  private String description;

  @NotNull
  @Column(nullable = false)
  private Integer credits = 3;

  @NotNull
  @Column(nullable = false)
  private Integer capacity = 100;

  @Column(nullable = false)
  private boolean active = true;

  @OneToMany(mappedBy = "course", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = false)
  @JsonIgnore
  private Set<Enrollment> enrollments = new HashSet<>();
}
