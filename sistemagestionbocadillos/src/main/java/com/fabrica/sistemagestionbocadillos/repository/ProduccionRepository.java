package com.fabrica.sistemagestionbocadillos.repository;

import com.fabrica.sistemagestionbocadillos.model.Produccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduccionRepository extends JpaRepository<Produccion, Long> {
}