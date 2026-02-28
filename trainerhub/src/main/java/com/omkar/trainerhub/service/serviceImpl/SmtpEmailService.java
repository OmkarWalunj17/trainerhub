package com.omkar.trainerhub.service.serviceImpl;

import com.omkar.trainerhub.service.EmailService;
import com.omkar.trainerhub.util.TrainerHubOTPTemplate;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class SmtpEmailService implements EmailService {

    private JavaMailSender mailSender;

    @Value("${app.mail.from.email}")
    private String fromEmail;

    @Value("${app.mail.from.name:TrainerConnect}")
    private String fromName;

    @Value("${app.mail.replyTo:support@trainerconnect.com}")
    private String replyTo;

    public SmtpEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        int validMinutes = 5;
        String subject = "TrainerConnect : Your OTP Code (Valid for 5 minutes)";
        String text = TrainerHubOTPTemplate.otpText(otp, validMinutes);
        String html = TrainerHubOTPTemplate.otpHtml(otp, validMinutes);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            helper.setFrom(new InternetAddress(fromEmail, fromName));
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setReplyTo(replyTo);
            helper.setText(text, html);
            mailSender.send(message);

        } catch (Exception ex) {
            throw new RuntimeException("Failed to send OTP email (SMTP)", ex);
        }
    }
}