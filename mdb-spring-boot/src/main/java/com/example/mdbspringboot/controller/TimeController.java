package com.example.mdbspringboot.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
public class TimeController {

    private static final Logger logger = LoggerFactory.getLogger(TimeController.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @PostMapping("/time")
    public Map<String, String> getTimeWithName(@RequestBody Map<String, String> request) {
        logger.info("Received request with name: {}", request.get("name"));
        
        String name = request.get("name");
        String currentTime = LocalDateTime.now().format(formatter);
        
        Map<String, String> response = new HashMap<>();
        response.put("name", name);
        response.put("currentTime", currentTime);
        
        logger.info("Returning response: {}", response);
        return response;
    }
} 