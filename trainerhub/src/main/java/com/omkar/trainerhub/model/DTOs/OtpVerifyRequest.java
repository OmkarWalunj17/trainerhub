package com.omkar.trainerhub.model.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OtpVerifyRequest {
    private String challengeId;
    private String otp;
}