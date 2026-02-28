package com.omkar.trainerhub.repository.modelrepos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.omkar.trainerhub.model.Feedback;

@Repository
public interface FeedbackRepo extends JpaRepository<Feedback,Long> {

    Page<Feedback> findAll(Pageable pageable);

    Page<Feedback> findByUser_UserId(Long userId, Pageable pageable);

    Page<Feedback> findByTrainer_TrainerId(Long trainerId, Pageable pageable);

    List<Feedback> findByUser_UserId(Long userId);


}

