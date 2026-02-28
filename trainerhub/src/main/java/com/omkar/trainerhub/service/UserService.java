package com.omkar.trainerhub.service;

import com.omkar.trainerhub.model.User;
import com.omkar.trainerhub.model.DTOs.LoginRequest;
import com.omkar.trainerhub.model.DTOs.LoginResponse;

public interface UserService {
    User createUser(User user);
    LoginResponse loginUser(LoginRequest req);
    User getById(Long userId);
    boolean verifyEmail(String token);
    void resendVerification(String email);
}
