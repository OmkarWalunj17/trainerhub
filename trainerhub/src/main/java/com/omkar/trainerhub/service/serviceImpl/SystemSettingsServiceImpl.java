package com.omkar.trainerhub.service.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
import com.omkar.trainerhub.model.SystemSettings;
import com.omkar.trainerhub.repository.modelrepos.SystemSettingsRepo;
import com.omkar.trainerhub.service.SystemSettingsService;
 
@Service
public class SystemSettingsServiceImpl implements SystemSettingsService {
 
    @Autowired
    private SystemSettingsRepo repo;
 
    @Override
    public boolean getAutoAssignStatus() {
        // Find existing settings or return a default new instance (where auto-assign is false)
        SystemSettings settings = repo.findById(1L).orElse(new SystemSettings());
        return settings.isAutoAssignEnabled();
    }
 
    @Override
    public boolean toggleAutoAssign(Boolean status) {
        SystemSettings settings = repo.findById(1L).orElse(new SystemSettings());
        settings.setId(1L); // Ensure we are always updating the same single row
        settings.setAutoAssignEnabled(status);
        repo.save(settings);
        return status;
    }
}