package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        System.out.println("I am been called ..." + String.valueOf(System.currentTimeMillis()));
        return "Hello, World!";
    }
}
