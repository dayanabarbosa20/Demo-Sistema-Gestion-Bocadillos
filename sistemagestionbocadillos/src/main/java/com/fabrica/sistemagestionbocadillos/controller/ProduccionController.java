package com.fabrica.sistemagestionbocadillos.controller;

import com.fabrica.sistemagestionbocadillos.model.Produccion;
import com.fabrica.sistemagestionbocadillos.model.Producto;
import com.fabrica.sistemagestionbocadillos.repository.ProduccionRepository;
import com.fabrica.sistemagestionbocadillos.repository.ProductoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produccion")
@CrossOrigin(origins = "http://localhost:5173")
public class ProduccionController {

    private final ProduccionRepository produccionRepository;
    private final ProductoRepository productoRepository;

    public ProduccionController(ProduccionRepository produccionRepository, ProductoRepository productoRepository) {
        this.produccionRepository = produccionRepository;
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<Produccion> listarProduccion() {
        return produccionRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> crearProduccion(@RequestBody Produccion produccion) {
        Producto producto = buscarProducto(produccion.getProducto());
        if (producto == null) {
            return ResponseEntity.badRequest().body("El producto indicado no existe.");
        }
        produccion.setProducto(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(produccionRepository.save(produccion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarProduccion(@PathVariable Long id, @RequestBody Produccion detalles) {
        return produccionRepository.findById(id)
            .<ResponseEntity<?>>map(produccion -> {
                Producto producto = buscarProducto(detalles.getProducto());
                if (producto == null) {
                    return ResponseEntity.badRequest().body("El producto indicado no existe.");
                }
                produccion.setCantidad(detalles.getCantidad());
                produccion.setCodigoLote(detalles.getCodigoLote());
                produccion.setEstado(detalles.getEstado());
                produccion.setFecha(detalles.getFecha());
                produccion.setProducto(producto);
                return ResponseEntity.ok(produccionRepository.save(produccion));
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProduccion(@PathVariable Long id) {
        if (!produccionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        produccionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Producto buscarProducto(Producto producto) {
        if (producto == null || producto.getId() == null) {
            return null;
        }
        return productoRepository.findById(producto.getId()).orElse(null);
    }
}