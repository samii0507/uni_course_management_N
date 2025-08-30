// src/main/java/com/university/cms/entities/Result.java
package com.university.cms.entities;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
  name = "results",
  uniqueConstraints = @UniqueConstraint(name = "uk_results_enrollment", columnNames = "enrollment_id")
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Result {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "enrollment_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_results_enrollment"))
  @JsonIgnore   // keeps JSON simple; remove if you use DTOs
  private Enrollment enrollment;

  @Column(length = 5)
  private String grade;

  @Column(precision = 5, scale = 2)   // e.g., 0.00 - 100.00
  private BigDecimal marks;           // <-- changed from Double to BigDecimal
}
