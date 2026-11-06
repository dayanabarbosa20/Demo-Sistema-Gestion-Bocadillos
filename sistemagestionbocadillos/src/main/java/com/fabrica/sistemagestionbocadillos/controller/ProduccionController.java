package com.fabrica.sistemagestionbocadillos.controller;

import com.fabrica.sistemagestionbocadillos.model.Produccion;
import com.fabrica.sistemagestionbocadillos.model.Producto;
import com.fabrica.sistemagestionbocadillos.repository.ProduccionRepository;
import com.fabrica.sistemagestionbocadillos.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
        if (produccion.getProducto() != null) {
            Long prodId = produccion.getProducto().getIdProducto();
            if (prodId == null) {
                prodId = produccion.getProducto().getId();
            }
            if (prodId != null) {
                Producto productoExistente = productoRepository.findById(prodId).orElse(null);
                if (productoExistente != null) {
                    produccion.setProducto(productoExistente);
                }
            }
        }
        Produccion produccionGuardada = produccionRepository.save(produccion);
        return ResponseEntity.ok(produccionGuardada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarProduccion(@PathVariable Long id, @RequestBody Produccion produccion) {
        if (!produccionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        produccion.setIdProduccion(id);
        if (produccion.getProducto() != null) {
            Long prodId = produccion.getProducto().getIdProducto();
            if (prodId == null) {
                prodId = produccion.getProducto().getId();
            }
            if (prodId != null) {
                Producto productoExistente = productoRepository.findById(prodId).orElse(null);
                if (productoExistente != null) {
                    produccion.setProducto(productoExistente);
                }
            }
        }
        return ResponseEntity.ok(produccionRepository.save(produccion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProduccion(@PathVariable Long id) {
        if (!produccionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        produccionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}