package com.omkar.trainerhub.service;

public interface EmailVerificationSenderService {
    public void sendVerificationEmail(String to, String verifyUrl);   
}
