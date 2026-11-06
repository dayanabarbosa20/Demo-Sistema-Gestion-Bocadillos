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
@RequestMapping({"/api/produccion", "/produccion"})
@CrossOrigin(origins = "*")
public class ProduccionController {

    @Autowired
    private ProduccionRepository produccionRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public List<Produccion> obtenerProduccion() {
        return produccionRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> crearProduccion(@RequestBody Produccion produccion) {
        if (produccion.getProducto() != null && produccion.getProducto().getId() != null) {
            Producto prod = productoRepository.findById(produccion.getProducto().getId()).orElse(null);
            produccion.setProducto(prod);
        }
        return ResponseEntity.ok(produccionRepository.save(produccion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarProduccion(@PathVariable Long id, @RequestBody Produccion detalles) {
        return produccionRepository.findById(id)
                .map(produccion -> {
                    produccion.setCodigoLote(detalles.getCodigoLote());
                    produccion.setCantidad(detalles.getCantidad());
                    produccion.setFecha(detalles.getFecha());
                    produccion.setEstado(detalles.getEstado());
                    if (detalles.getProducto() != null && detalles.getProducto().getId() != null) {
                        Producto prod = productoRepository.findById(detalles.getProducto().getId()).orElse(null);
                        produccion.setProducto(prod);
                    }
                    return ResponseEntity.ok(produccionRepository.save(produccion));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProduccion(@PathVariable Long id) {
        if (produccionRepository.existsById(id)) {
            produccionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}