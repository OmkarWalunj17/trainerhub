package com.omkar.trainerhub.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "email_verification_tokens", indexes = {
    @Index(name = "idx_evt_token_hash", columnList = "tokenHash", unique = true),
    @Index(name = "idx_evt_user_id", columnList = "userId")
})

@Getter
@Setter
public class EmailVerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, unique = true, length = 64)
    // SHA-256 hex
    private String tokenHash; 

    @Column(nullable = false)
    private Instant expiresAt;

    private Instant usedAt;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}