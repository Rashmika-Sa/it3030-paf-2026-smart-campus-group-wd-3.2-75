package com.wd32._5.smart_campus.controller;

import com.wd32._5.smart_campus.dto.AuthResponse;
import com.wd32._5.smart_campus.dto.GoogleAuthRequest;
import com.wd32._5.smart_campus.dto.LoginRequest;
import com.wd32._5.smart_campus.dto.OtpVerifyRequest;
import com.wd32._5.smart_campus.dto.RegisterRequest;
import com.wd32._5.smart_campus.service.AuthService;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/request-otp")
    public AuthResponse requestRegisterOtp(@RequestBody RegisterRequest request) {
        return authService.requestRegisterOtp(request);
    }

    @PostMapping("/login/request-otp")
    public AuthResponse requestLoginOtp(@RequestBody LoginRequest request) {
        return authService.requestLoginOtp(request);
    }

    @PostMapping("/verify-otp")
    public AuthResponse verifyOtp(@RequestBody OtpVerifyRequest request) {
        return authService.verifyOtp(request);
    }

    @PostMapping("/google")
    public AuthResponse google(@RequestBody GoogleAuthRequest request) {
        return authService.googleLogin(request);
    }

    @GetMapping("/me")
    public Map<String, Object> me(@RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED,
                    "Authorization header missing or invalid"
            );
        }
        String token = authorization.substring(7).trim();
        return authService.getCurrentUserByToken(token);
    }
}