package com.example.mdbspringboot.interceptor;

import com.example.mdbspringboot.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(JwtInterceptor.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Skip JWT validation for login endpoint
        if (request.getRequestURI().equals("/api/login")) {
            logger.debug("Skipping JWT validation for login endpoint");
            return true;
        }

        // Log all headers for debugging
        logger.debug("Request headers:");
        request.getHeaderNames().asIterator().forEachRemaining(headerName -> {
            logger.debug("{}: {}", headerName, request.getHeader(headerName));
        });

        String authHeader = request.getHeader("Authorization");
        logger.debug("Authorization header: {}", authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("No valid Authorization header found for request: {}", request.getRequestURI());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"No valid Authorization header found\"}");
            return false;
        }

        String token = authHeader.substring(7); // Remove "Bearer " prefix
        logger.debug("Token extracted: {}", token);

        String username = jwtUtil.validateToken(token);
        if (username == null) {
            logger.warn("Invalid token for request: {}", request.getRequestURI());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Invalid token\"}");
            return false;
        }

        // Add username to request attributes for use in controllers
        request.setAttribute("username", username);
        logger.debug("Token validated for user: {}", username);
        return true;
    }
} 