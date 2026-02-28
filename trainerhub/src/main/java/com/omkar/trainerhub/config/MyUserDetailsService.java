package com.omkar.trainerhub.config;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.modelrepos.UserRepo;

@Service
public class MyUserDetailsService implements UserDetailsService {

    private UserRepo userRepo;
    
    public MyUserDetailsService(UserRepo userRepo)
    {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User Not Found");
        }
        return new UserPrinciple(user);
    }
}