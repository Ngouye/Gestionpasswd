package com.example.gestionmotpasse.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.gestionmotpasse.model.AuthRequest;
import com.example.gestionmotpasse.model.AuthResponse;
import com.example.gestionmotpasse.model.RegisterRequest;
import com.example.gestionmotpasse.model.UserAccount;
import com.example.gestionmotpasse.repository.UserRepository;
import com.example.gestionmotpasse.security.CustomUserDetailsService;
import com.example.gestionmotpasse.security.JwtUtils;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtils jwtUtils,
                       CustomUserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé.");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Ce nom d'utilisateur est déjà utilisé.");
        }

        UserAccount user = new UserAccount(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword())
        );
        userRepository.save(user);
        return new AuthResponse(jwtUtils.generateToken(userDetailsService.loadUserByUsername(user.getEmail())), user.getUsername(), user.getEmail());
    }

    public AuthResponse authenticate(AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            com.example.gestionmotpasse.security.UserDetailsImpl principal = (com.example.gestionmotpasse.security.UserDetailsImpl) authentication.getPrincipal();
            String token = jwtUtils.generateToken(principal);
            return new AuthResponse(token, principal.getDisplayName(), principal.getEmail());
        } catch (AuthenticationException ex) {
            throw new IllegalArgumentException("Email ou mot de passe incorrect.");
        }
    }
}
