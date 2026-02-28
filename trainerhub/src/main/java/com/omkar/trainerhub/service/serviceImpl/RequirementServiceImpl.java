package com.omkar.trainerhub.service.serviceImpl;
 
import java.util.List;
import java.util.Optional;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
 
import com.omkar.trainerhub.exceptions.DuplicateRequirementException;
import com.omkar.trainerhub.exceptions.TrainerDeletionException;
import com.omkar.trainerhub.model.Payment;
import com.omkar.trainerhub.model.Requirement;
import com.omkar.trainerhub.model.SystemSettings;
import com.omkar.trainerhub.model.Trainer;
import com.omkar.trainerhub.model.User;
import com.omkar.trainerhub.repository.PaymentRepo;
import com.omkar.trainerhub.repository.modelrepos.RequirementRepo;
import com.omkar.trainerhub.repository.modelrepos.SystemSettingsRepo;
import com.omkar.trainerhub.repository.modelrepos.TrainerRepo;
import com.omkar.trainerhub.repository.modelrepos.UserRepo;
import com.omkar.trainerhub.service.RequirementService;
 
@Service
public class RequirementServiceImpl implements RequirementService {
 
    private RequirementRepo requirementRepo;
    private UserRepo userRepo;
    private PaymentRepo paymentRepo;
    private TrainerRepo trainerRepo;
    private SystemSettingsRepo systemSettingsRepo;
 
    @Autowired
    public RequirementServiceImpl(RequirementRepo requirementRepo, UserRepo userRepo, TrainerRepo trainerRepo, PaymentRepo paymentRepo, SystemSettingsRepo systemSettingsRepo) {
        this.requirementRepo = requirementRepo;
        this.userRepo = userRepo;
        this.trainerRepo = trainerRepo;
        this.paymentRepo = paymentRepo;
        this.systemSettingsRepo = systemSettingsRepo;
    }
 
    @Override
    public Requirement addRequirement(Requirement requirement) throws DuplicateRequirementException {
 
        String title = requirement.getTitle();
        String department = requirement.getDepartment();
 
        if (title == null || department == null) {
            throw new IllegalArgumentException("Title and Department must not be null");
        }
 
        boolean exists = requirementRepo.existsByTitleIgnoreCaseAndDepartmentIgnoreCase(title.trim(), department.trim());
        if (exists) {
            throw new DuplicateRequirementException("Requirement already exists with title '" + title + "' in department '" + department + "'");
        }
 
        if (requirement.getManager() == null || requirement.getManager().getUserId() == null) {
            throw new IllegalArgumentException("Manager details are required (manager.userId must be provided)");
        }
 
        Long managerId = requirement.getManager().getUserId();
        User manager = userRepo.findById(managerId).orElseThrow(() -> new IllegalArgumentException("Invalid managerId: " + managerId));
 
        if (manager.getUserRole() == null || !manager.getUserRole().equalsIgnoreCase("Manager")) {
            throw new IllegalArgumentException("Provided user is not a Manager");
        }
 
        requirement.setManager(manager);
 
        if (requirement.getTrainer() != null && requirement.getTrainer().getTrainerId() != null) {
            Trainer trainer = trainerRepo.findById(requirement.getTrainer().getTrainerId()).orElse(null);
            requirement.setTrainer(trainer);
        }
 
        if (requirement.getPaymentStatus() == null) {
            requirement.setPaymentStatus("N/A");
        }
        SystemSettings settings = systemSettingsRepo.findById(1L).orElse(new SystemSettings());
       
        if (settings.isAutoAssignEnabled() && requirement.getTrainer() == null && requirement.getBudget() != null) {
           
            List<Trainer> activeTrainers = trainerRepo.findByStatusIgnoreCase("Active");
           
            // 20% Profit Buffer: Trainer expected salary must be <= 80% of manager's budget
            double maxAllowedSalary = requirement.getBudget() * 0.80;
 
            for (Trainer t : activeTrainers) {
                if (t.getExpectedSalary() != null && t.getExpectedSalary() <= maxAllowedSalary) {
                   
                    String expertise = t.getExpertise().toLowerCase();
                    String reqTitle = requirement.getTitle().toLowerCase();
                    String reqDept = requirement.getDepartment().toLowerCase();
                   
                    // Match Expertise with Title or Department
                    if (reqTitle.contains(expertise) || reqDept.contains(expertise) || expertise.contains(reqTitle)) {
                        requirement.setTrainer(t);
                        requirement.setStatus("Open"); // Ready for manager to accept and pay
                        requirement.setPaymentStatus("Pending");
                        break;
                    }
                }
            }
        }
 
        return requirementRepo.save(requirement);
    }
 
    private String determinePaymentStatus(Requirement r) {
        if (r.getTrainer() == null) return "N/A";
        java.util.List<Payment> payments = paymentRepo.findByRequirementId(r.getRequirementId());
        boolean isPaid = payments.stream().anyMatch(p -> "Paid".equalsIgnoreCase(p.getStatus()));
        if (isPaid || "Closed".equalsIgnoreCase(r.getStatus())) return "Completed";
        return "Pending";
    }
 
    @Override
    public Optional<Requirement> getRequirementById(Long requirementId) {
        Optional<Requirement> req = requirementRepo.findById(requirementId);
        req.ifPresent(r -> r.setPaymentStatus(determinePaymentStatus(r)));
        return req;
    }
 
    @Override
    public List<Requirement> getAllRequirements() {
        List<Requirement> reqs = requirementRepo.findAll();
        reqs.forEach(r -> r.setPaymentStatus(determinePaymentStatus(r)));
        return reqs;
    }
 
    @Override
    public Requirement updateRequirement(Long requirementId, Requirement updatedRequirement) {
        Requirement exist = requirementRepo.findById(requirementId).orElse(null);
        if (exist == null) return null;
 
        exist.setTitle(updatedRequirement.getTitle());
        exist.setDescription(updatedRequirement.getDescription());
        exist.setDepartment(updatedRequirement.getDepartment());
        exist.setPostedDate(updatedRequirement.getPostedDate());
        exist.setStatus(updatedRequirement.getStatus());
        exist.setDuration(updatedRequirement.getDuration());
        exist.setMode(updatedRequirement.getMode());
        exist.setLocation(updatedRequirement.getLocation());
        exist.setSkillLevel(updatedRequirement.getSkillLevel());
        exist.setBudget(updatedRequirement.getBudget());
        exist.setPriority(updatedRequirement.getPriority());
        exist.setPaymentStatus(updatedRequirement.getPaymentStatus());
       
 
        if (updatedRequirement.getTrainer() != null && updatedRequirement.getTrainer().getTrainerId() != null) {
            Long trainerId = updatedRequirement.getTrainer().getTrainerId();
            Trainer trainer = trainerRepo.findById(trainerId).orElse(null);
            exist.setTrainer(trainer);
        } else {
            exist.setTrainer(null);
        }
 
        exist.setStatus(updatedRequirement.getStatus());
        exist.setPaymentStatus(determinePaymentStatus(exist));
        return requirementRepo.save(exist);
    }
 
    @Override
    public Requirement deleteRequirement(Long requirementId) throws TrainerDeletionException {
        Requirement exist = requirementRepo.findById(requirementId).orElse(null);
        requirementRepo.delete(exist);
        return exist;
    }
 
    @Override
    public List<Requirement> getRequirementsByTrainerId(Long trainerId) {
        return requirementRepo.findByTrainer_TrainerId(trainerId);
    }
 
    @Override
    public Page<Requirement> getRequirementsPagedByManager(Long managerId, String search, String status, Pageable pageable) {
        String term = (search == null) ? "" : search.trim();
        String st = (status == null) ? "" : status.trim();
        if (!term.isEmpty() && !st.isEmpty()) {
            return requirementRepo.findByManager_UserIdAndTitleContainingIgnoreCaseAndStatusIgnoreCase(managerId, term, st, pageable);
        } else if (!term.isEmpty()) {
            return requirementRepo.findByManager_UserIdAndTitleContainingIgnoreCase(managerId, term, pageable);
        } else if (!st.isEmpty()) {
            return requirementRepo.findByManager_UserIdAndStatusIgnoreCase(managerId, st, pageable);
        } else {
            return requirementRepo.findByManager_UserId(managerId, pageable);
        }
    }
 
    @Override
    public Page<Requirement> getSelectedRequirementsPagedByManager(Long managerId, String search, Pageable pageable) {
        if (search != null && !search.trim().isEmpty()) {
            return requirementRepo.findByManager_UserIdAndStatusIgnoreCaseAndTrainerIsNotNullAndTitleContainingIgnoreCase(managerId, "Closed", search.trim(), pageable);
        }
        return requirementRepo.findByManager_UserIdAndStatusIgnoreCaseAndTrainerIsNotNull(managerId, "Closed", pageable);
    }
}