package com.omkar.trainerhub.service.serviceImpl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.omkar.trainerhub.config.MyUserDetailsService;
import com.omkar.trainerhub.model.EmailVerificationToken;
import com.omkar.trainerhub.model.OTPVerification;
import com.omkar.trainerhub.model.User;
import com.omkar.trainerhub.model.DTOs.LoginRequest;
import com.omkar.trainerhub.model.DTOs.LoginResponse;
import com.omkar.trainerhub.repository.EmailVerificationTokenRepo;
import com.omkar.trainerhub.repository.modelrepos.UserRepo;
import com.omkar.trainerhub.service.EmailVerificationSenderService;
import com.omkar.trainerhub.service.OTPService;
import com.omkar.trainerhub.service.UserService;
import com.omkar.trainerhub.util.VerificationTokenUtil;
import jakarta.transaction.Transactional;

@Service
public class UserServiceImpl implements UserService {

    private EmailVerificationTokenRepo emailVerificationTokenRepo;
    private EmailVerificationSenderService emailVerificationSenderService;
    private MyUserDetailsService service;
    private UserRepo userRepo;
    @Lazy
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private OTPService otpService;

    public UserServiceImpl(EmailVerificationTokenRepo emailVerificationTokenRepo, EmailVerificationSenderService emailVerificationSenderService, MyUserDetailsService service, UserRepo userRepo, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, OTPService otpService)
    {
        this.emailVerificationTokenRepo = emailVerificationTokenRepo;
        this.emailVerificationSenderService = emailVerificationSenderService;
        this.service = service;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.otpService = otpService;
    }
    
    private String frontendUrl = "https://8081-daacfbbbcdcbfbedecafccabecddeceefcfdc.premiumproject.examly.io";

    @Value("${app.verification.token-ttl-minutes:60}")
    private long tokenTtlMinutes;
    
    @Override
    public User createUser(User user) {


    user.setEmail(user.getEmail().trim().toLowerCase());
    
    if (userRepo.existsByEmail(user.getEmail())) {
        throw new RuntimeException("Email already exists");
    }


    user.setUsername(user.getUsername().trim());

    user.setPassword(passwordEncoder.encode(user.getPassword()));
    user.setUserRole(user.getUserRole().trim().toUpperCase());
    user.setEmailVerified(false);
    User saved = userRepo.save(user);
    
    issueAndSendVerificationToken(saved);
    
    return saved;
}

    private void issueAndSendVerificationToken(User user) 
    {
        emailVerificationTokenRepo.deleteByUserId(user.getUserId());

        String rawToken = VerificationTokenUtil.generateRawToken();
        String tokenHash = VerificationTokenUtil.sha256Hex(rawToken);

        EmailVerificationToken token = new EmailVerificationToken();
        token.setUserId(user.getUserId());
        token.setTokenHash(tokenHash);
        token.setExpiresAt(Instant.now().plus(tokenTtlMinutes, ChronoUnit.MINUTES));
        
        emailVerificationTokenRepo.save(token);

        String verifyUrl = frontendUrl + "/verify-email?token=" + rawToken;
        emailVerificationSenderService.sendVerificationEmail(user.getEmail(), verifyUrl);
    }
    
    @Override
    public LoginResponse loginUser(LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        if (!authentication.isAuthenticated()) {
            throw new RuntimeException("Invalid credentials");
        }

        User authUser = userRepo.findByEmail(loginRequest.getEmail());
        if (authUser == null) {
            throw new RuntimeException("User not found");
        }

        if (!authUser.isEmailVerified()) {
            LoginResponse response = new LoginResponse();
            response.setStatus("EmailNotVerified");
            System.out.println(authUser.isEmailVerified());
            return response;
        }

        OTPVerification otpVerification = otpService.createOTPVerificationProcess(loginRequest.getEmail());

        LoginResponse response = new LoginResponse();
        response.setStatus("2FARequired");
        response.setChallengeId(otpVerification.getId());
        return response;
    }


    @Override
    public User getById(Long userId) {
        if(userRepo.existsById(userId)){
            return userRepo.findById(userId).get();
        }
        return null;
    }

    @Override
    public boolean verifyEmail(String token) 
    {
        try {
            if (token == null || token.isBlank()) {
                return false;
            }

            String tokenHash = VerificationTokenUtil.sha256Hex(token);

            
            EmailVerificationToken storedToken = emailVerificationTokenRepo.findByTokenHash(tokenHash).get();
            
            if (token == null) 
            {
                return false;
            }

            if (storedToken.getUsedAt() != null) {
                return false;
            }

            if (storedToken.getExpiresAt() != null &&
                storedToken.getExpiresAt().isBefore(Instant.now())) {
                return false;
            }

            Long uid = storedToken.getUserId();
            User user = userRepo.findById(uid).get();
            if (user == null) {
                return false;
            }

            user.setEmailVerified(true);
            userRepo.save(user);

            storedToken.setUsedAt(Instant.now());
            emailVerificationTokenRepo.save(storedToken);

            return true;

        } catch (Exception e) {
            return false;
    }
}

    @Override
    @Transactional
    public void resendVerification(String email) {

        if (email == null || email.isBlank()) {
            return; // Do not reveal anything
        }

        User user = userRepo.findByEmail(email);

        if (user == null) return;

        if (user.isEmailVerified()) return;

        issueAndSendVerificationToken(user);
    }

}