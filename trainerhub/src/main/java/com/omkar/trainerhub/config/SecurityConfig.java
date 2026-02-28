package com.omkar.trainerhub.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint)
    {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                .requestMatchers(HttpMethod.POST, "/api/register", "/api/login", "/api/verify-otp", "/api/resend-verification", "api/settings/auto-assign").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/verify-email/**").permitAll()
                
                // TRAINER
                .requestMatchers(HttpMethod.POST, "/api/trainer").hasRole("COORDINATOR")
                .requestMatchers(HttpMethod.PUT, "/api/trainer/**").hasRole("COORDINATOR")
                .requestMatchers(HttpMethod.GET, "/api/trainer/**").hasAnyRole("MANAGER", "COORDINATOR")
                

                // REQUIREMENT
                .requestMatchers(HttpMethod.POST, "/api/requirement").hasRole("MANAGER")
                .requestMatchers(HttpMethod.GET, "/api/requirement").hasAnyRole("MANAGER", "COORDINATOR")
                .requestMatchers(HttpMethod.GET, "/api/requirement/*").hasRole("MANAGER")

                // FEEDBACK
                .requestMatchers(HttpMethod.POST, "/api/feedback").hasRole("MANAGER")
                .requestMatchers(HttpMethod.GET, "/api/feedback").hasAnyRole("MANAGER", "COORDINATOR")
                .requestMatchers(HttpMethod.GET, "/api/feedback/user/*").hasRole("MANAGER")
                .requestMatchers(HttpMethod.GET, "/api/feedback/*").hasAnyRole("MANAGER", "COORDINATOR")

                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
