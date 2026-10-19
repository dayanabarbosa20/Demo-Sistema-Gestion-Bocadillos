package com.fabrica.sistemagestionbocadillos.controller;

import com.fabrica.sistemagestionbocadillos.model.Producto;
import com.fabrica.sistemagestionbocadillos.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(
    origins = "http://localhost:5173",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    // 1. CREAR (POST)
    @PostMapping
    public ResponseEntity<Producto> guardarProducto(@RequestBody Producto producto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoRepository.save(producto));
    }

    // 2. OBTENER TODOS (GET)
    @GetMapping
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    // 3. OBTENER POR ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        Optional<Producto> producto = productoRepository.findById(id);
        if (producto.isPresent()) {
            return ResponseEntity.ok(producto.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Producto no encontrado\"}");
    }

    // 4. ACTUALIZAR (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarProducto(@PathVariable Long id, @RequestBody Producto detalles) {
        Optional<Producto> productoOpt = productoRepository.findById(id);
        if (productoOpt.isPresent()) {
            Producto producto = productoOpt.get();
            producto.setNombre(detalles.getNombre());
            producto.setPrecio(detalles.getPrecio());
            producto.setCantidad(detalles.getCantidad());
            return ResponseEntity.ok(productoRepository.save(producto));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Producto no encontrado\"}");
    }

    // 5. ELIMINAR (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProducto(@PathVariable Long id) {
        if (productoRepository.existsById(id)) {
            productoRepository.deleteById(id);
            return ResponseEntity.ok("{\"mensaje\": \"Producto eliminado exitosamente\"}");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Producto no encontrado\"}");
    }
}