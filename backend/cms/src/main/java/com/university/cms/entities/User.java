// User.java
package com.university.cms.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(
  name = "users",
  uniqueConstraints = {
    @UniqueConstraint(name = "uk_users_email", columnNames = "email"),
    @UniqueConstraint(name = "uk_users_username", columnNames = "username")
  }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Email @NotBlank
  @Column(nullable = false, length = 255)
  private String email;

  @NotBlank
  @Column(nullable = false, length = 100)
  private String username;

  // Never send password in responses
  @NotBlank
  @Column(nullable = false, length = 255)
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private String password;

  @Column(nullable = false)
  private boolean isAdmin = false;

  @OneToMany(mappedBy = "student", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = false)
  @JsonIgnore  // <<< prevent lazy collection from being serialized
  private Set<Enrollment> enrollments = new HashSet<>();
}
