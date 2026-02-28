package com.omkar.trainerhub.repository.modelrepos;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.omkar.trainerhub.model.Requirement;

@Repository
public interface RequirementRepo extends JpaRepository<Requirement, Long> {

    List<Requirement> findByTrainer_TrainerId(Long trainerId);

    boolean existsByTitleIgnoreCaseAndDepartmentIgnoreCase(String title, String department);

    Page<Requirement> findByManager_UserId(Long managerId, Pageable pageable);

    Page<Requirement> findByManager_UserIdAndTitleContainingIgnoreCase(Long managerId, String title, Pageable pageable);

    Page<Requirement> findByManager_UserIdAndStatusIgnoreCase(Long managerId, String status, Pageable pageable);

    Page<Requirement> findByManager_UserIdAndTitleContainingIgnoreCaseAndStatusIgnoreCase(Long managerId, String title, String status, Pageable pageable);

    Page<Requirement> findByManager_UserIdAndStatusIgnoreCaseAndTrainerIsNotNull(Long managerId, String status, Pageable pageable);

    Page<Requirement> findByStatusIgnoreCaseAndTrainerIsNotNullAndTitleContainingIgnoreCase(String status, String title, Pageable pageable);
    
    Page<Requirement> findByManager_UserIdAndStatusIgnoreCaseAndTrainerIsNotNullAndTitleContainingIgnoreCase(Long managerId, String status, String title, Pageable pageable);
}