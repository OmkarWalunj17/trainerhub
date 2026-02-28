package com.omkar.trainerhub.service.serviceImpl;

import com.omkar.trainerhub.service.EmailVerificationSenderService;
import com.omkar.trainerhub.util.TrainerHubEmailVerificationTemplate;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailVerificationSenderServiceImpl implements EmailVerificationSenderService{

    private JavaMailSender mailSender;
    @Lazy
    @Autowired
    private EmailVerificationSenderService emailVerificationSenderService;

    public EmailVerificationSenderServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String email, String verifyUrl) {
        String html = TrainerHubEmailVerificationTemplate.verificationHtml(verifyUrl, 10);
        String text = TrainerHubEmailVerificationTemplate.verificationText(verifyUrl, 10);

        sendHtmlEmail(email, "Verify your email - TrainerHub", html, text);
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody, String textBody) {
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(textBody, htmlBody);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }
}
