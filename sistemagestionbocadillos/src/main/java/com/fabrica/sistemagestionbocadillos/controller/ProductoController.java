package com.fabrica.sistemagestionbocadillos.controller;

import com.fabrica.sistemagestionbocadillos.model.Producto;
import com.fabrica.sistemagestionbocadillos.repository.ProductoRepository;
import com.fabrica.sistemagestionbocadillos.service.ProductoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(
    origins = "https://sistemagestionbocadillos.netlify.app",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowCredentials = "false"
)
public class ProductoController {

    private static final Logger logger = LoggerFactory.getLogger(ProductoController.class);

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ProductoService productoService;

    // 1. CREAR (POST)
    @PostMapping
    @Transactional
    public ResponseEntity<Producto> guardarProducto(@RequestBody Producto producto) {
        if (productoRepository.count() == 0) {
            try {
                productoService.reiniciarSecuenciaProductos();
            } catch (Exception e) {
            }
        }
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
            producto.setCategoria(detalles.getCategoria());
            producto.setUnidad(detalles.getUnidad());
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