package com.fabrica.sistemagestionbocadillos;

import com.fabrica.sistemagestionbocadillos.model.Producto; 
import com.fabrica.sistemagestionbocadillos.repository.ProductoRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductoRepository productoRepository;

    public DataInitializer(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (productoRepository.count() == 0) {
            Producto p1 = new Producto();
            p1.setNombre("Panelitas");
            p1.setPrecio(3500.0);

            Producto p2 = new Producto();
            p2.setNombre("Bocadillo veleño");
            p2.setPrecio(4500.0);

            Producto p3 = new Producto();
            p3.setNombre("Guacamaya");
            p3.setPrecio(4500.0);

            Producto p4 = new Producto();
            p4.setNombre("Herpus");
            p4.setPrecio(5500.0);

            Producto p5 = new Producto();
            p5.setNombre("Lonja");
            p5.setPrecio(5250.0);

            productoRepository.saveAll(List.of(p1, p2, p3, p4, p5));
            System.out.println(">>> Datos iniciales de productos cargados con éxito <<<");
        }
    }
}