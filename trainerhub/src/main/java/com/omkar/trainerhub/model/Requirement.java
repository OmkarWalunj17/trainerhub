package com.omkar.trainerhub.model;


import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
 
@Entity
@Getter
@Setter
public class Requirement {
 
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long requirementId;
 
    private String title;
    private String description;
    private String department;
    private LocalDate postedDate;
    private String status;
    private String duration;
    private String mode;
    private String location;
    private String skillLevel;
    private Double budget;
    private String priority;
    private String paymentStatus;
 
    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = true)
    private Trainer trainer;
 
    @ManyToOne
    @JoinColumn(name = "manager_id", nullable = true)
    private User manager;
 
}