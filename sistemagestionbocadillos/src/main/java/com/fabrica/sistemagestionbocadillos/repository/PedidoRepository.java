package com.fabrica.sistemagestionbocadillos.repository;

import com.fabrica.sistemagestionbocadillos.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}