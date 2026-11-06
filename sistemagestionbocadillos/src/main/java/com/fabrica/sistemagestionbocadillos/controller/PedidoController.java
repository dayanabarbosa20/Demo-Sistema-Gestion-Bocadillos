package com.fabrica.sistemagestionbocadillos.controller;

import com.fabrica.sistemagestionbocadillos.model.Pedido;
import com.fabrica.sistemagestionbocadillos.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/pedidos", "/pedidos"})
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @GetMapping
    public List<Pedido> obtenerPedidos() {
        return pedidoRepository.findAll();
    }

    @PostMapping
    public Pedido crearPedido(@RequestBody Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pedido> actualizarPedido(@PathVariable Long id, @RequestBody Pedido detalles) {
        return pedidoRepository.findById(id)
                .map(pedido -> {
                    pedido.setCliente(detalles.getCliente());
                    pedido.setFecha(detalles.getFecha());
                    pedido.setTotal(detalles.getTotal());
                    pedido.setEstado(detalles.getEstado());
                    return ResponseEntity.ok(pedidoRepository.save(pedido));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Long id) {
        if (pedidoRepository.existsById(id)) {
            pedidoRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}