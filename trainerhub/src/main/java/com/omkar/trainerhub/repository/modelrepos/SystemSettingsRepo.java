package com.omkar.trainerhub.repository.modelrepos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.omkar.trainerhub.model.SystemSettings;
 
@Repository
public interface SystemSettingsRepo extends JpaRepository<SystemSettings, Long> {
}