package com.wd32._5.smart_campus.config;

import com.wd32._5.smart_campus.entity.Role;
import com.wd32._5.smart_campus.entity.User;
import com.wd32._5.smart_campus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.admin.password}")
    private String adminPassword;

    @Value("${app.seed.technician.password}")
    private String technicianPassword;

    public DatabaseSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            User admin = userRepository.findByEmail("admin@my.sliit.lk").orElse(new User());
            admin.setName("System Admin");
            admin.setEmail("admin@my.sliit.lk");
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("✅ Admin user seeded/updated successfully!");

            User technician = userRepository.findByEmail("technician@my.sliit.lk").orElse(new User());
            technician.setName("Lab Technician");
            technician.setEmail("technician@my.sliit.lk");
            technician.setPassword(passwordEncoder.encode(technicianPassword));
            technician.setRole(Role.TECHNICIAN);
            userRepository.save(technician);
            System.out.println("✅ Technician user seeded/updated successfully!");
        } catch (Exception e) {
            System.err.println("⚠️ Seeding skipped — MongoDB not reachable at startup: " + e.getMessage());
        }
    }
}