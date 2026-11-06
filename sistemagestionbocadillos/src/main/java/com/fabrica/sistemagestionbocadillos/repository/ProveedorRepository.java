package com.fabrica.sistemagestionbocadillos.repository;

import com.fabrica.sistemagestionbocadillos.model.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {
    Optional<Proveedor> findByNombre(String nombre);
    boolean existsByNombreIgnoreCase(String nombre);
    boolean existsByNombreIgnoreCaseAndIdProveedorNot(String nombre, Long idProveedor);
}