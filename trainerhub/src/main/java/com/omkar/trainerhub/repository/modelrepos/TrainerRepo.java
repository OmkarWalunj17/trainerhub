package com.omkar.trainerhub.repository.modelrepos;

import java.util.List;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.omkar.trainerhub.model.Trainer;
 
@Repository
public interface TrainerRepo extends JpaRepository<Trainer, Long> {
   boolean existsByEmailIgnoreCaseAndTrainerIdNot(String email, Long trainerid);
   boolean existsByEmailIgnoreCase(String email);
   List<Trainer> findByStatusIgnoreCase(String status);
}