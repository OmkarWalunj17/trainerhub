package com.omkar.trainerhub.service;

public interface SystemSettingsService {
    boolean getAutoAssignStatus();
    boolean toggleAutoAssign(Boolean status);
}
