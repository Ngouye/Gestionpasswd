package com.example.gestionmotpasse.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gestionmotpasse.model.UserAccount;

public interface UserRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
