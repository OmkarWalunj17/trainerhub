package com.omkar.trainerhub.repository.modelrepos;

import org.springframework.data.jpa.repository.JpaRepository;
import com.omkar.trainerhub.model.User;

public interface UserRepo extends JpaRepository<User, Long> {

    User findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByMobileNumber(String mobileNumber);
}

