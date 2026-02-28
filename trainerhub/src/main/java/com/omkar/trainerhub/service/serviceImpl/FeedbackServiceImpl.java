package com.omkar.trainerhub.service.serviceImpl;


import java.util.List;

import javax.swing.plaf.basic.BasicTreeUI.TreeHomeAction;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.omkar.trainerhub.model.Feedback;
import com.omkar.trainerhub.model.Trainer;
import com.omkar.trainerhub.model.User;
import com.omkar.trainerhub.repository.modelrepos.FeedbackRepo;
import com.omkar.trainerhub.repository.modelrepos.TrainerRepo;
import com.omkar.trainerhub.repository.modelrepos.UserRepo;
import com.omkar.trainerhub.service.FeedbackService;

@Service
public class FeedbackServiceImpl implements FeedbackService {
 
    private FeedbackRepo feedbackRepo;
    private UserRepo userRepo;
    private TrainerRepo trainerRepo;

    public FeedbackServiceImpl(FeedbackRepo feedbackRepo, UserRepo userRepo, TrainerRepo trainerRepo) {
        this.feedbackRepo = feedbackRepo;
        this.userRepo = userRepo;
        this.trainerRepo = trainerRepo;
    }

    @Override
    public Feedback createFeedback(Feedback feedback) {

        if (feedback.getTrainer() != null) {
            Trainer trainer = trainerRepo.findById(feedback.getTrainer().getTrainerId()).orElse(null);
            feedback.setTrainer(trainer);
        }
        if (feedback.getUser() != null && feedback.getUser().getUserId() != null) {

            User user = userRepo.findById(feedback.getUser().getUserId()).orElse(null);
            feedback.setUser(user);
        }

        return feedbackRepo.save(feedback);
    }

    @Override
    public Feedback deleteFeedback(Long feedbackId) {
        if (feedbackRepo.existsById(feedbackId)) {
            Feedback f = feedbackRepo.findById(feedbackId).get();
            feedbackRepo.deleteById(feedbackId);

            return f;
        }
        return null;
    }

    @Override
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepo.findAll();
    }

    @Override
    public Feedback getFeedbackById(Long feedbackId) {
        if (feedbackRepo.existsById(feedbackId)) {
            return feedbackRepo.findById(feedbackId).get();
        }
        return null;
    }

    @Override
    public List<Feedback> getFeedbacksByUserId(Long userId) {
        if (userRepo.existsById(userId)) {
            return feedbackRepo.findAll();
        }
        return null;
    }

    @Override
    public Page<Feedback> getAllFeedbacksPaged(Pageable pageable) {
        return feedbackRepo.findAll(pageable);
    }

    @Override
    public Page<Feedback> getFeedbacksByUserIdPaged(Long userId, Pageable pageable) {
        return feedbackRepo.findByUser_UserId(userId, pageable);
    }

}

