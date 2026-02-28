package com.omkar.trainerhub.service.serviceImpl;

package com.examly.springapp.service.serviceImpl;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.exceptions.DuplicateTrainerException;
import com.examly.springapp.exceptions.TrainerDeletionException;
import com.examly.springapp.model.Requirement;
import com.examly.springapp.model.Trainer;
import com.examly.springapp.repository.modelrepos.RequirementRepo;
import com.examly.springapp.repository.modelrepos.TrainerRepo;
import com.examly.springapp.service.TrainerService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class TrainerServiceImpl implements TrainerService {
    private TrainerRepo trepo;
    private RequirementRepo rrepo;

    @Autowired
    public TrainerServiceImpl(TrainerRepo trepo, RequirementRepo rrepo){
        this.trepo = trepo;
        this.rrepo = rrepo;
    }

    @Override
    public Trainer addTrainer(Trainer trainer) {   
        boolean exists = trepo.existsByEmailIgnoreCase(trainer.getEmail());
        if (exists) {
            throw new DuplicateTrainerException("A trainer with this email already exists.");
        }
        return trepo.save(trainer);
    }

    
    @Override
    public List<Trainer> getAllTrainers() {
        return trepo.findAll();
    }
    
    @Override
    public Trainer getTrainerById(Long trainerId) {
        return trepo.findById(trainerId).orElse(null);
    }
    
    @Override
    public Trainer updateTrainer(Long trainerId, Trainer updatedTrainer) {

        if (updatedTrainer.getEmail() != null && trepo.existsByEmailIgnoreCaseAndTrainerIdNot(updatedTrainer.getEmail(), trainerId)) {
            throw new DuplicateTrainerException("Another trainer already uses the email: " + updatedTrainer.getEmail());
        }

        if(trepo.existsById(trainerId)){
            updatedTrainer.setTrainerId(trainerId);
            return trepo.save(updatedTrainer);
        } else{
            return null;
        }
    }
    
    @Override
    public Trainer deleteTrainer(Long trainerId) 
    {
        Trainer trainer = trepo.findById(trainerId).orElseThrow(() -> new EntityNotFoundException("Trainer not found: " + trainerId));
        List<Requirement> requirement = rrepo.findByTrainer_TrainerId(trainerId);

        if ("Active".equalsIgnoreCase(trainer.getStatus()) || requirement.size() > 0) 
        {
            throw new TrainerDeletionException("Cannot delete a trainer who is Active/assigned.");
        }

        trepo.deleteById(trainerId);
        return trainer;
    }
}
