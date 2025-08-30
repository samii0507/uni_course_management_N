package com.university.cms.controllers;

import com.university.cms.entities.Result;
import com.university.cms.services.ResultService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResultController {

    private final ResultService resultService;

    @PostMapping("/update")
    public ResponseEntity<Result> update(@RequestBody ResultRequest request) {
        return ResponseEntity.ok(
                resultService.updateResult(request.getEnrollmentId(), request.getGrade(), request.getMarks())
        );
    }

    @GetMapping("/{enrollmentId}")
    public ResponseEntity<Result> getResult(@PathVariable Long enrollmentId) {
        return ResponseEntity.ok(resultService.getResultByEnrollment(enrollmentId));
    }

    @Data static class ResultRequest {
        private Long enrollmentId;
        private String grade;
        private Double marks;
    }
}
