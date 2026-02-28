package com.omkar.trainerhub.exceptions;
 
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
 
@RestControllerAdvice
public class GlobalExceptionHandler {
 
    @ExceptionHandler(DuplicateRequirementException.class)
    public ResponseEntity<?> handleDuplicateRequirement(DuplicateRequirementException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatusCode.valueOf(400));
    }
 
    @ExceptionHandler(DuplicateTrainerException.class)
    public ResponseEntity<?> handleDuplicateTrainer(DuplicateTrainerException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }
 
    @ExceptionHandler(TrainerDeletionException.class)
    public ResponseEntity<?> handleTrainerDeletion(TrainerDeletionException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatusCode.valueOf(400));
    }
 
    @ExceptionHandler(RequirementDeletionException.class)
    public ResponseEntity<?> handleRequirementDeletion(RequirementDeletionException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatusCode.valueOf(400));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntime(RuntimeException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ex.getMessage());
    }
}
 