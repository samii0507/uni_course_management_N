package com.university.cms.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.university.cms.entities.User;
import com.university.cms.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User registerUser(String email, String username, String password, boolean isAdmin) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already in use");
        }

        User user = User.builder()
                .email(email)
                .username(username)
                .password(password)   // ⚠ stored in plain text
                .isAdmin(isAdmin)
                .build();

        return userRepository.save(user);
    }

    public Optional<User> login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password));
    }

    public Iterable<User> findAll() {
        return userRepository.findAll();
    }

    public User updateAdminStatus(Long userId, boolean isAdmin) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setAdmin(isAdmin);
        return userRepository.save(user);
    }
}
