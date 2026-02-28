package com.omkar.trainerhub.service;

import com.omkar.trainerhub.model.Requirement;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RequirementService {
    Requirement addRequirement(Requirement requirement);
    Optional<Requirement> getRequirementById(Long requirementId);
    List<Requirement> getAllRequirements();
    Requirement updateRequirement(Long requirementId, Requirement updatedRequirement);
    Requirement deleteRequirement(Long requirementId);
    List<Requirement> getRequirementsByTrainerId(Long trainerId);
    Page<Requirement> getRequirementsPagedByManager(Long managerId,String search,String status, Pageable pageable);
    Page<Requirement> getSelectedRequirementsPagedByManager(Long managerId, String search, Pageable pageable);
}