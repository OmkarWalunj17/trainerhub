package com.omkar.trainerhub.service;

import com.omkar.trainerhub.model.Feedback;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FeedbackService {
    Feedback createFeedback(Feedback feedback);
    Feedback getFeedbackById(Long feedbackId);
    List<Feedback> getAllFeedbacks();
    Feedback deleteFeedback(Long feedbackId);
    List<Feedback> getFeedbacksByUserId(Long userId);
    Page<Feedback> getAllFeedbacksPaged(Pageable pageable);
    Page<Feedback> getFeedbacksByUserIdPaged(Long userId, Pageable pageable);

}