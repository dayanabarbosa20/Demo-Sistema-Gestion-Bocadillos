package com.fabrica.sistemagestionbocadillos.controller;

import com.fabrica.sistemagestionbocadillos.model.Proveedor;
import com.fabrica.sistemagestionbocadillos.repository.ProveedorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(
        origins = "http://localhost:5173",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class ProveedorController {

    private final ProveedorRepository proveedorRepository;

    public ProveedorController(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    @GetMapping
    public List<Proveedor> listarProveedores() {
        return proveedorRepository.findAll();
    }

    @GetMapping("/{nombre}")
    public ResponseEntity<Proveedor> obtenerPorNombre(@PathVariable String nombre) {
        return proveedorRepository.findByNombre(nombre)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Proveedor> crearProveedor(@RequestBody Proveedor proveedor) {
        proveedor.setIdProveedor(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(proveedorRepository.save(proveedor));
    }

    @PutMapping("/{nombre}")
    public ResponseEntity<Proveedor> actualizarProveedor(
            @PathVariable String nombre,
            @RequestBody Proveedor detalles
    ) {
        return proveedorRepository.findByNombre(nombre)
                .map(proveedor -> {
                    proveedor.setNombre(detalles.getNombre());
                    proveedor.setTelefono(detalles.getTelefono());
                    proveedor.setCorreo(detalles.getCorreo());
                    proveedor.setEstado(detalles.getEstado());
                    return ResponseEntity.ok(proveedorRepository.save(proveedor));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{nombre}")
    public ResponseEntity<Void> eliminarProveedor(@PathVariable String nombre) {
        return proveedorRepository.findByNombre(nombre)
                .map(proveedor -> {
                    proveedorRepository.delete(proveedor);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}