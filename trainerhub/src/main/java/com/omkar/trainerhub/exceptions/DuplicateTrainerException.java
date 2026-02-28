package com.omkar.trainerhub.exceptions;

public class DuplicateTrainerException extends RuntimeException {
    public DuplicateTrainerException(String message) {
        super(message);
    }
}