package com.omkar.trainerhub.model;


import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "otp_verification")
public class OTPVerification {

    @Id
    private String id;

    private String username;

    @Column(length = 100)
    private String otpHash;

    private Instant createdAt;
    private Instant expiresAt;

    private int attempts;
    private boolean used;
}
