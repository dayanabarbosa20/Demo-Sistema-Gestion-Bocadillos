package com.fabrica.sistemagestionbocadillos.controller;

import com.fabrica.sistemagestionbocadillos.model.Usuario;
import com.fabrica.sistemagestionbocadillos.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
    origins = "http://localhost:5173",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class AuthController {

    @Autowired
    private AuthService authService;

    // Endpoint 1: Registrar usuario (POST /api/auth/register)
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = authService.registrar(usuario);
            
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Usuario registrado exitosamente");
            respuesta.put("usuario", nuevoUsuario);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Endpoint 2: Iniciar sesión / Login (POST /api/auth/login)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        try {
            String email = credenciales.get("email");
            String password = credenciales.get("password");

            Usuario usuario = authService.login(email, password);

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Inicio de sesión exitoso");
            respuesta.put("usuario", usuario);

            return ResponseEntity.ok(respuesta);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
}