package com.fabrica.sistemagestionbocadillos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "produccion")
public class Produccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProduccion;

    private String codigoLote;
    private Integer cantidad;
    private String fecha;
    private String estado;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    @JsonIgnoreProperties({"producciones", "hibernateLazyInitializer", "handler"})
    private Producto producto;

    public Produccion() {}

    public Produccion(Long idProduccion, String codigoLote, Integer cantidad, String fecha, String estado, Producto producto) {
        this.idProduccion = idProduccion;
        this.codigoLote = codigoLote;
        this.cantidad = cantidad;
        this.fecha = fecha;
        this.estado = estado;
        this.producto = producto;
    }

    public Long getIdProduccion() { return idProduccion; }
    public void setIdProduccion(Long idProduccion) { this.idProduccion = idProduccion; }

    public String getCodigoLote() { return codigoLote; }
    public void setCodigoLote(String codigoLote) { this.codigoLote = codigoLote; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
}