package com.corilus.user_profile_management.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseTest implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.execute("SELECT 1");
            System.out.println("✅ Connexion à MariaDB réussie !");
        } catch (Exception e) {
            System.err.println("❌ Erreur de connexion à MariaDB : " + e.getMessage());
        }
    }
}
