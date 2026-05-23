package com.example.gestionmotpasse;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootTest
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class})
class GestionMotPasseApplicationTests {

    @Test
    void contextLoads() {
        // Ce test reste vide, il sert juste à vérifier le démarrage sans BDD
    }
}