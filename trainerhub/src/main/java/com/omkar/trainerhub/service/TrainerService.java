package com.omkar.trainerhub.service;

import com.omkar.trainerhub.model.Trainer;
import java.util.List;

public interface TrainerService {
    Trainer addTrainer(Trainer trainer);
    Trainer getTrainerById(Long trainerId);
    List<Trainer> getAllTrainers();
    Trainer updateTrainer(Long trainerId, Trainer updatedTrainer);
    Trainer deleteTrainer(Long trainerId);
    
}
