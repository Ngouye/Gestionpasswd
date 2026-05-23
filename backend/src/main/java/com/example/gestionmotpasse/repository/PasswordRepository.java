package com.example.gestionmotpasse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.gestionmotpasse.model.PasswordEntry;

@Repository
public interface PasswordRepository extends JpaRepository<PasswordEntry, Long> {
}
