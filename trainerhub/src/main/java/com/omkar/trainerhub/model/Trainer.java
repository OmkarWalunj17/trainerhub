package com.omkar.trainerhub.model;

import java.time.LocalDate;
import jakarta.persistence.Lob;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
 
@Entity
@Getter
@Setter
public class Trainer {
   
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long trainerId;
   
    private String name;
    private String email;
    private String phone;
    private String expertise;
    private String experience;
    private String certification;
    private Double expectedSalary;
   
    @Lob
    @Column(columnDefinition="LONGTEXT")
    private String resume;
    private LocalDate joiningDate;
    private String status;
}