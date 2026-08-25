/**
 * PROYECTO: Sistema de Gestión - Fábrica de Bocadillos
 * EVIDENCIA: GA7-220501096-AA3-EV01
 * 
 * JUSTIFICACIÓN DEL FRAMEWORK:
 * Se selecciona el framework Spring Boot para el desarrollo backend debido a su
 * arquitectura basada en MVC, servidor web Tomcat embebido y gestión simplificada
 * de la capa de persistencia con Spring Data JPA y MySQL.
 */
package com.fabrica.sistemagestionbocadillos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SistemagestionbocadillosApplication {

    public static void main(String[] args) {
        SpringApplication.run(SistemagestionbocadillosApplication.class, args);

    }
}


