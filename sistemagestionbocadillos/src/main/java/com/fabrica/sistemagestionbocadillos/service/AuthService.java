package com.fabrica.sistemagestionbocadillos.service;

import com.fabrica.sistemagestionbocadillos.model.Usuario;
import com.fabrica.sistemagestionbocadillos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Método para registrar un nuevo usuario
    public Usuario registrar(Usuario usuario) {
        // Validación 1: Verificar si el correo ya existe en la base de datos
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(usuario.getEmail());
        if (usuarioExistente.isPresent()) {
            throw new RuntimeException("El correo electrónico ya se encuentra registrado.");
        }
        
        // Guardar en la base de datos si todo está en orden
        usuario.setCorreo(usuario.getEmail());
        return usuarioRepository.save(usuario);
    }

    // Método para validar las credenciales del login
    public Usuario login(String email, String password) {
        // Validación 2: Buscar si el usuario existe
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("El usuario con ese correo no existe.");
        }

        Usuario usuario = usuarioOpt.get();

        // Validación 3: Comparar la contraseña ingresada con la de la BD
        if (!usuario.getPassword().equals(password)) {
            throw new RuntimeException("La contraseña ingresada es incorrecta.");
        }

        return usuario;
    }
}