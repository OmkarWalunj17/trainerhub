package com.omkar.trainerhub.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.omkar.trainerhub.model.OTPVerification;

@Repository
public interface OTPVerificationRepository extends JpaRepository<OTPVerification, String> {
    List<OTPVerification> findByUsernameAndUsedFalseAndExpiresAtAfter(String username, Instant now);
}

