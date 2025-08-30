package com.university.cms.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.university.cms.entities.User;
import com.university.cms.services.UserService;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    /** GET /api/users — list all users */
    @GetMapping
    public Iterable<User> list() {
        return userService.findAll();
    }

    /** PUT /api/users/{id}/admin — toggle/set admin status */
    @PutMapping("/{id}/admin")
    public ResponseEntity<User> setAdmin(@PathVariable Long id, @RequestBody UpdateAdminRequest body) {
        User updated = userService.updateAdminStatus(id, body.isAdmin);
        return ResponseEntity.ok(updated);
    }

    @Data
    public static class UpdateAdminRequest {
        private boolean isAdmin;
    }
}
