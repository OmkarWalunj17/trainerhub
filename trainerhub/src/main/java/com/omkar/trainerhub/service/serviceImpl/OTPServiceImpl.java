package com.omkar.trainerhub.service.serviceImpl;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.omkar.trainerhub.model.OTPVerification;
import com.omkar.trainerhub.repository.OTPVerificationRepository;
import com.omkar.trainerhub.service.EmailService;
import com.omkar.trainerhub.service.OTPService;

@Service
public class OTPServiceImpl implements OTPService {

    private final OTPVerificationRepository repo;
    private final PasswordEncoder encoder = new BCryptPasswordEncoder();
    private final SecureRandom random = new SecureRandom();
    private EmailService emailService;

    private static final int OTP_DIGITS = 6;
    private static final int OTP_EXPIRY_SECONDS = 300; // 5 minutes
    private static final int MAX_ATTEMPTS = 5;

    public OTPServiceImpl(OTPVerificationRepository repo, EmailService emailService) {
        this.repo = repo;
        this.emailService = emailService;
    }

    @Override
    public OTPVerification createOTPVerificationProcess(String username) {

        List<OTPVerification> active = repo.findByUsernameAndUsedFalseAndExpiresAtAfter(username, Instant.now());
        for (OTPVerification c : active) {
            c.setUsed(true); // or set expiresAt = now
        }
        repo.saveAll(active);

        String otp = generateNumericOtp(OTP_DIGITS);

        OTPVerification c = new OTPVerification();
        c.setId(UUID.randomUUID().toString());
        c.setUsername(username);
        c.setOtpHash(encoder.encode(otp));
        c.setCreatedAt(Instant.now());
        c.setExpiresAt(Instant.now().plusSeconds(OTP_EXPIRY_SECONDS));
        c.setAttempts(0);
        c.setUsed(false);

        repo.save(c);

        emailService.sendOtpEmail(username, otp);
        return c;
    }

    @Override
    public String verifyAndGetUsername(String challengeId, String otp) 
    {
        OTPVerification c = repo.findById(challengeId).orElse(null);
        if (c == null) return null;

        if (c.isUsed()) return null;
        if (Instant.now().isAfter(c.getExpiresAt())) return null;
        if (c.getAttempts() > 5) return null;

        boolean ok = encoder.matches(otp, c.getOtpHash());
        if (!ok) {
            c.setAttempts(c.getAttempts() + 1);
            repo.save(c);
            return null;
        }

        c.setUsed(true);
        repo.save(c);
        return c.getUsername();
    }

    private String generateNumericOtp(int digits) {
        int bound = (int) Math.pow(10, digits);
        int code = random.nextInt(bound);
        return String.format("%0" + digits + "d", code);
    }

    @Override
    public boolean resendOtp(String challengeId) {
        // TODO Auto-generated method stub
        return false;
    }
}