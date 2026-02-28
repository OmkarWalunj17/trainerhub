package com.omkar.trainerhub.service;

import com.omkar.trainerhub.model.OTPVerification;

public interface OTPService {
    OTPVerification createOTPVerificationProcess(String username);
    String verifyAndGetUsername(String challengeId, String otp);
    boolean resendOtp(String challengeId);
}