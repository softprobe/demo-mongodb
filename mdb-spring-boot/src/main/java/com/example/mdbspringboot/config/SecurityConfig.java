package com.example.mdbspringboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.disable()) // Disable CORS
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers("/api/login").permitAll()
                    .requestMatchers("/time").permitAll()
                    .anyRequest().authenticated() // 所有请求需认证
            )
            .addFilterBefore(new JwtFilter(), UsernamePasswordAuthenticationFilter.class) // 添加 JWT 过滤器
            .csrf(csrf -> csrf.disable());

        return http.build();
    }
}
