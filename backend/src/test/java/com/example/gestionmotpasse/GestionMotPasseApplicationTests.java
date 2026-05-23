package com.example.gestionmotpasse;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test") // Cette ligne dit à Spring d'utiliser le fichier application-test.properties
public class GestionMotPasseApplicationTests {

    @Test
    void contextLoads() {
        // Le contexte va se charger avec la fausse base H2 en mémoire !
    }
}