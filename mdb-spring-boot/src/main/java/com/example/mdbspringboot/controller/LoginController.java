package com.example.mdbspringboot.controller;

import com.example.mdbspringboot.util.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LoginController {

    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

    // Simple in-memory user store
    private static final Map<String, String> USERS = new HashMap<>();
    static {
        USERS.put("admin", "password");
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        logger.info("Health check requested");
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        logger.info("Login attempt for user: {}", loginRequest.getUsername());
        logger.debug("Login request body: {}", loginRequest);
        
        if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
            logger.warn("Login failed: username or password is null");
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required"));
        }
        
        String storedPassword = USERS.get(loginRequest.getUsername());
        logger.debug("Stored password for user {}: {}", loginRequest.getUsername(), 
            storedPassword != null ? "exists" : "not found");
        
        if (storedPassword != null && storedPassword.equals(loginRequest.getPassword())) {
            logger.info("Login successful for user: {}", loginRequest.getUsername());
            try {
                String token = JwtUtils.makeAccessToken(loginRequest.getUsername());
                logger.debug("Generated token for user {}: {}", loginRequest.getUsername(), token);
                return ResponseEntity.ok(Map.of("token", token));
            } catch (Exception e) {
                logger.error("Error generating token for user {}: {}", loginRequest.getUsername(), e.getMessage());
                return ResponseEntity.status(500).body(Map.of("error", "Error generating token"));
            }
        }
        
        logger.warn("Login failed for user: {}", loginRequest.getUsername());
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }

    // Inner class for login request
    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        @Override
        public String toString() {
            return "LoginRequest{" +
                    "username='" + username + '\'' +
                    ", password='[PROTECTED]'" +
                    '}';
        }
    }
}
