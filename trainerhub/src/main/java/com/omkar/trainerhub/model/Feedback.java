package com.omkar.trainerhub.model;


import java.time.LocalDate;
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
public class Feedback {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long feedbackId;
    
    private String feedbackText;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name="userId",nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "trainerId",nullable = true)
    private Trainer trainer;
    private String category;
}

