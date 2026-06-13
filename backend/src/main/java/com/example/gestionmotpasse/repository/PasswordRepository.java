package com.example.gestionmotpasse.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gestionmotpasse.model.PasswordEntry;

public interface PasswordRepository extends JpaRepository<PasswordEntry, Long> {
}
