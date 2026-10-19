package com.fabrica.sistemagestionbocadillos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "produccion")
public class Produccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produccion")
    private Long idProduccion;

    @Column(name = "cantidad")
    private Integer cantidad;

    @Column(name = "codigo_lote")
    private String codigoLote;

    @Column(name = "estado")
    private String estado;

    @Column(name = "fecha")
    private LocalDate fecha;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_producto", referencedColumnName = "id_producto")
    private Producto producto;

    public Long getIdProduccion() { return idProduccion; }
    public Integer getCantidad() { return cantidad; }
    public String getCodigoLote() { return codigoLote; }
    public String getEstado() { return estado; }
    public LocalDate getFecha() { return fecha; }
    public Producto getProducto() { return producto; }

    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public void setCodigoLote(String codigoLote) { this.codigoLote = codigoLote; }
    public void setEstado(String estado) { this.estado = estado; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public void setProducto(Producto producto) { this.producto = producto; }
}