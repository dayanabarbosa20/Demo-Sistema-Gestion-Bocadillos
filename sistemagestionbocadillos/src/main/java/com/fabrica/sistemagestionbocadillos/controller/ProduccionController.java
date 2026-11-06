package com.fabrica.sistemagestionbocadillos.controller;

import com.fabrica.sistemagestionbocadillos.model.Produccion;
import com.fabrica.sistemagestionbocadillos.model.Producto;
import com.fabrica.sistemagestionbocadillos.repository.ProduccionRepository;
import com.fabrica.sistemagestionbocadillos.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produccion")
@CrossOrigin(origins = "*")
public class ProduccionController {

    @Autowired
    private ProduccionRepository produccionRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public List<Produccion> obtenerProducciones() {
        return produccionRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> crearProduccion(@RequestBody Produccion produccion) {
        try {
            Producto productoExistente = productoRepository.findById(produccion.getProducto().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
            produccion.setProducto(productoExistente);
            Produccion produccionGuardada = produccionRepository.save(produccion);
            return ResponseEntity.ok(produccionGuardada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en backend: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarProduccion(@PathVariable Long id, @RequestBody Produccion produccion) {
        try {
            if (!produccionRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            produccion.setIdProduccion(id);
            Producto productoExistente = productoRepository.findById(produccion.getProducto().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
            produccion.setProducto(productoExistente);
            return ResponseEntity.ok(produccionRepository.save(produccion));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en backend: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProduccion(@PathVariable Long id) {
        try {
            if (!produccionRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            produccionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en backend: " + e.getMessage());
        }
    }
}