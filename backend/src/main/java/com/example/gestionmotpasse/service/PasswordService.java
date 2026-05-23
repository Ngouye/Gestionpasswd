package com.example.gestionmotpasse.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.gestionmotpasse.model.PasswordDto;
import com.example.gestionmotpasse.model.PasswordEntry;
import com.example.gestionmotpasse.repository.PasswordRepository;
import com.example.gestionmotpasse.util.EncryptionUtil;

@Service
public class PasswordService {
    private final PasswordRepository passwordRepository;
    private final String secretKey;

    public PasswordService(PasswordRepository passwordRepository, @Value("${app.encryption.key}") String secretKey) {
        this.passwordRepository = passwordRepository;
        this.secretKey = secretKey;
    }

    public List<PasswordDto> getAll() {
        return passwordRepository.findAll().stream().map(this::toDto).toList();
    }

    public PasswordDto create(PasswordDto dto) {
        PasswordEntry entry = new PasswordEntry(
                dto.getTitle(),
                dto.getUsername(),
                EncryptionUtil.encrypt(dto.getPassword(), secretKey),
                dto.getUrl(),
                dto.getNotes()
        );
        return toDto(passwordRepository.save(entry));
    }

    public PasswordDto update(Long id, PasswordDto dto) {
        return passwordRepository.findById(id).map(existing -> {
            existing.setTitle(dto.getTitle());
            existing.setUsername(dto.getUsername());
            existing.setEncryptedPassword(EncryptionUtil.encrypt(dto.getPassword(), secretKey));
            existing.setUrl(dto.getUrl());
            existing.setNotes(dto.getNotes());
            return toDto(passwordRepository.save(existing));
        }).orElse(null);
    }

    public boolean delete(Long id) {
        if (passwordRepository.existsById(id)) {
            passwordRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private PasswordDto toDto(PasswordEntry entry) {
        return new PasswordDto(
                entry.getId(),
                entry.getTitle(),
                entry.getUsername(),
                EncryptionUtil.decrypt(entry.getEncryptedPassword(), secretKey),
                entry.getUrl(),
                entry.getNotes()
        );
    }
}
