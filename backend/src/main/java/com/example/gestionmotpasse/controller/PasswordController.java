package com.example.gestionmotpasse.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.gestionmotpasse.model.PasswordDto;
import com.example.gestionmotpasse.service.PasswordService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/passwords")
@CrossOrigin(origins = "*")
public class PasswordController {

    private final PasswordService passwordService;

    public PasswordController(PasswordService passwordService) {
        this.passwordService = passwordService;
    }

    @GetMapping
    public List<PasswordDto> listPasswords() {
        return passwordService.getAll();
    }

    @PostMapping
    public ResponseEntity<PasswordDto> createPassword(@Valid @RequestBody PasswordDto dto) {
        PasswordDto created = passwordService.create(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PasswordDto> updatePassword(@PathVariable Long id, @Valid @RequestBody PasswordDto dto) {
        PasswordDto updated = passwordService.update(id, dto);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePassword(@PathVariable Long id) {
        return passwordService.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
