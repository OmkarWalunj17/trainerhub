package com.omkar.trainerhub.model.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OtpVerifyResponse {
    private String token;
    private Long userId;
    private String email;
    private String username;
    private String userRole;
}
