import React, { useCallback, useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import api from '../services/api';

const INVENTORY_STORAGE_KEY = 'bocadillos-inventory';

const TARJETAS_REPORTE = [
  { id: 'inventario', titulo: 'Reporte de Inventario', subtitulo: 'INFORME DE INVENTARIO', icono: 'inventory_2' },
  { id: 'produccion', titulo: 'Reporte de Producción', subtitulo: 'INFORME DE PRODUCCIÓN', icono: 'precision_manufacturing' },
  { id: 'pedidos', titulo: 'Reporte de Pedidos', subtitulo: 'INFORME DE PEDIDOS', icono: 'shopping_cart' },
  { id: 'proveedores', titulo: 'Reporte de Proveedores', subtitulo: 'INFORME DE PROVEEDORES', icono: 'local_shipping' },
];

function extraerLista(respuesta) {
  const data = respuesta?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function leerLocalStorageSeguro(claves) {
  for (const clave of claves) {
    try {
      const raw = localStorage.getItem(clave);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Ignorar clave inválida y continuar
    }
  }
  return [];
}

function formatearCodigo3Digitos(valor, indexFallback = 0) {
  const texto = String(valor ?? '').trim();
  if (/^\d+$/.test(texto)) return texto.padStart(3, '0');
  return String(indexFallback + 1).padStart(3, '0');
}

function formatearFecha(fecha) {
  if (!fecha) return '—';
  const limpia = String(fecha).split('T')[0];
  const [anio, mes, dia] = limpia.split('-');
  return anio && mes && dia ? `${dia}/${mes}/${anio}` : limpia;
}

function formatearMoneda(valor) {
  const numero = Number(String(valor ?? 0).replace(/[^\d.-]/g, '')) || 0;
  return `$ ${numero.toLocaleString('es-CO')}`;
}

function obtenerEstadoInventario(cantidad, stockMinimo) {
  if (Number(cantidad) === 0) {
    return { texto: 'Agotado', bg: '#fee2e2', color: '#991b1b' };
  }
  if (Number(cantidad) <= Number(stockMinimo)) {
    return { texto: 'Stock Bajo', bg: '#ffedd5', color: '#9a3412' };
  }
  return { texto: 'Disponible', bg: '#dcfce7', color: '#166534' };
}

function obtenerBadgeEstado(estadoRaw) {
  const texto = String(estadoRaw || 'Activo').trim();
  const normalizado = texto.toLowerCase();

  if (['entregado', 'terminado', 'activo', 'disponible'].includes(normalizado)) {
    return { texto, bg: '#dcfce7', color: '#166534' };
  }
  if (['en proceso', 'en preparación', 'enviado', 'stock bajo'].includes(normalizado)) {
    return { texto, bg: '#fef3c7', color: '#92400e' };
  }
  if (['pendiente'].includes(normalizado)) {
    return { texto, bg: '#ffedd5', color: '#9a3412' };
  }
  return { texto, bg: '#fee2e2', color: '#991b1b' };
}

const estilos = {
  gridTarjetas: {
    position: 'relative',
    zIndex: 10,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '18px',
    marginBottom: '26px',
  },
  tarjeta: (activa) => ({
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '22px 20px',
    border: activa ? '2px solid #115c36' : '1px solid #e5e7eb',
    boxShadow: activa ? '0 6px 16px rgba(17, 92, 54, 0.14)' : '0 2px 6px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '12px',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.15s ease',
  }),
  iconoTarjeta: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    backgroundColor: '#f0fdf4',
    color: '#115c36',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  tituloTarjeta: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 700,
    color: '#1f2937',
    pointerEvents: 'none',
  },
  botonTarjeta: (activa) => ({
    width: '100%',
    backgroundColor: activa ? '#0d4a2b' : '#115c36',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '9px 14px',
    fontSize: '0.88rem',
    fontWeight: 600,
    cursor: 'pointer',
  }),
  hojaDocumento: {
    position: 'relative',
    zIndex: 5,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '28px 32px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
  },
  encabezadoDocumento: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '20px',
  },
  empresaTitulo: {
    margin: '0 0 4px 0',
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#115c36',
    letterSpacing: '0.3px',
  },
  informeSubtitulo: {
    margin: 0,
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#374151',
    letterSpacing: '0.5px',
  },
  metaDerecha: {
    textAlign: 'right',
    fontSize: '0.85rem',
    color: '#4b5563',
    lineHeight: 1.5,
  },
  barraAccionesDoc: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginBottom: '14px',
  },
  botonSecundario: {
    backgroundColor: '#f0fdf4',
    color: '#115c36',
    border: '1px solid #bbf7d0',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
  },
  resumenPie: {
    marginTop: '14px',
    paddingTop: '12px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px',
    fontSize: '0.88rem',
    color: '#374151',
    fontWeight: 600,
  },
};

export default function Reportes() {
  const [reporteActivo, setReporteActivo] = useState('inventario');
  const [cargando, setCargando] = useState(false);
  const [datosModulos, setDatosModulos] = useState({
    inventario: [],
    produccion: [],
    pedidos: [],
    proveedores: [],
  });

  const cargarDatosReales = useCallback(async () => {
    setCargando(true);

    const inventarioLocal = leerLocalStorageSeguro([INVENTORY_STORAGE_KEY]).map((item, index) => ({
      id: item.id ?? index,
      codigo: formatearCodigo3Digitos(item.codigo ?? item.productoId, index),
      producto: item.producto ?? item.nombre ?? '—',
      cantidad: Number(item.cantidad) || 0,
      unidad: item.unidad || 'Unidad',
      stockMinimo: Number(item.stockMinimo) || 0,
      vence: item.vence || '',
    }));

    const [resProduccion, resPedidos, resProveedores] = await Promise.allSettled([
      api.get('/produccion'),
      api.get('/pedidos'),
      api.get('/proveedores'),
    ]);

    const rawProduccion =
      resProduccion.status === 'fulfilled'
        ? extraerLista(resProduccion.value)
        : leerLocalStorageSeguro(['bocadillos-produccion', 'bocadillos-production', 'produccion']);

    const rawPedidos =
      resPedidos.status === 'fulfilled'
        ? extraerLista(resPedidos.value)
        : leerLocalStorageSeguro(['bocadillos-pedidos', 'pedidos']);

    const rawProveedores =
      resProveedores.status === 'fulfilled'
        ? extraerLista(resProveedores.value)
        : leerLocalStorageSeguro(['bocadillos-proveedores', 'proveedores']);

    const produccionNormalizada = rawProduccion.map((lote, index) => ({
      id: lote.id ?? index,
      codigoLote: lote.codigoLote ?? lote.codigo ?? `LOTE-${String(index + 1).padStart(3, '0')}`,
      producto: lote.producto ?? lote.nombreProducto ?? '—',
      cantidad: Number(lote.cantidad) || 0,
      fecha: lote.fecha || '',
      estado: lote.estado || 'Pendiente',
    }));

    const pedidosNormalizados = rawPedidos.map((pedido, index) => ({
      id: pedido.id ?? pedido.idPedido ?? index,
      codigoVisual: String(index + 1).padStart(3, '0'),
      cliente: pedido.cliente || '—',
      fecha: pedido.fecha || '',
      total: Number(String(pedido.total ?? 0).replace(/[^\d.-]/g, '')) || 0,
      estado: pedido.estado || 'Pendiente',
    }));

    const proveedoresNormalizados = rawProveedores.map((prov, index) => ({
      id: prov.id ?? index,
      codigoVisual: String(index + 1).padStart(3, '0'),
      nombre: prov.nombre ?? prov.proveedor ?? '—',
      insumo: prov.insumo ?? prov.producto ?? '—',
      telefono: prov.telefono || '—',
      correo: prov.correo || '—',
      estado: prov.estado || 'Activo',
    }));

    setDatosModulos({
      inventario: inventarioLocal,
      produccion: produccionNormalizada,
      pedidos: pedidosNormalizados,
      proveedores: proveedoresNormalizados,
    });

    setCargando(false);
  }, []);

  useEffect(() => {
    cargarDatosReales();
  }, [cargarDatosReales]);

  const seleccionarReporte = (id) => {
    setReporteActivo(id);
  };

  const tarjetaActual = TARJETAS_REPORTE.find((t) => t.id === reporteActivo) || TARJETAS_REPORTE[0];
  const fechaEmision = new Date().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const totalVentasPedidos = datosModulos.pedidos.reduce((acc, item) => acc + item.total, 0);

  return (
    <AppShell activePath="/reportes">
      <section className="content-body">
        <div className="page-title-zone">
          <div className="title-icon">
            <span className="material-symbols-outlined size-xl">bar_chart</span>
          </div>
          <div>
            <h2>Reportes</h2>
            <p className="subtitle">Genera y consulta reportes de la fábrica</p>
          </div>
        </div>

        {/* Tarjetas selectoras de reporte (toda la tarjeta es clicable) */}
        <div style={estilos.gridTarjetas}>
          {TARJETAS_REPORTE.map((tarjeta) => {
            const seleccionada = reporteActivo === tarjeta.id;
            return (
              <div
                key={tarjeta.id}
                role="button"
                tabIndex={0}
                aria-pressed={seleccionada}
                style={estilos.tarjeta(seleccionada)}
                onClick={() => seleccionarReporte(tarjeta.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    seleccionarReporte(tarjeta.id);
                  }
                }}
              >
                <div style={estilos.iconoTarjeta}>
                  <span className="material-symbols-outlined">{tarjeta.icono}</span>
                </div>
                <h3 style={estilos.tituloTarjeta}>{tarjeta.titulo}</h3>
                <button
                  type="button"
                  style={estilos.botonTarjeta(seleccionada)}
                  onClick={(event) => {
                    event.stopPropagation();
                    seleccionarReporte(tarjeta.id);
                  }}
                >
                  {seleccionada ? 'Seleccionado ✓' : 'Generar Reporte'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Documento de vista previa del informe */}
        <div style={estilos.hojaDocumento}>
          <div style={estilos.barraAccionesDoc}>
            <button type="button" style={estilos.botonSecundario} onClick={cargarDatosReales} disabled={cargando}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>refresh</span>
              {cargando ? 'Sincronizando...' : 'Actualizar datos'}
            </button>
            <button type="button" style={estilos.botonSecundario} onClick={() => window.print()}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>print</span>
              Imprimir / PDF
            </button>
          </div>

          <div style={estilos.encabezadoDocumento}>
            <div>
              <h3 style={estilos.empresaTitulo}>FÁBRICA DE BOCADILLOS VELEÑOS</h3>
              <p style={estilos.informeSubtitulo}>{tarjetaActual.subtitulo}</p>
            </div>
            <div style={estilos.metaDerecha}>
              <div><strong>Emisión:</strong> {fechaEmision}</div>
              <div><strong>Sistema:</strong> Gestión Integral</div>
            </div>
          </div>

          <div className="table-container" style={{ overflowX: 'auto' }}>
            {reporteActivo === 'inventario' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Unidad</th>
                    <th>Stock Mín</th>
                    <th>Vence</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {datosModulos.inventario.length > 0 ? datosModulos.inventario.map((item) => {
                    const estado = obtenerEstadoInventario(item.cantidad, item.stockMinimo);
                    return (
                      <tr key={item.id}>
                        <td>{item.codigo}</td>
                        <td>{item.producto}</td>
                        <td>{item.cantidad}</td>
                        <td>{item.unidad}</td>
                        <td>{item.stockMinimo}</td>
                        <td>{formatearFecha(item.vence)}</td>
                        <td>
                          <span
                            style={{
                              backgroundColor: estado.bg,
                              color: estado.color,
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              display: 'inline-block',
                            }}
                          >
                            {estado.texto}
                          </span>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                        No hay entradas de inventario registradas en el módulo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {reporteActivo === 'produccion' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código de lote</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {datosModulos.produccion.length > 0 ? datosModulos.produccion.map((lote) => {
                    const badge = obtenerBadgeEstado(lote.estado);
                    return (
                      <tr key={lote.id}>
                        <td>{lote.codigoLote}</td>
                        <td>{lote.producto}</td>
                        <td>{lote.cantidad}</td>
                        <td>{formatearFecha(lote.fecha)}</td>
                        <td>
                          <span
                            style={{
                              backgroundColor: badge.bg,
                              color: badge.color,
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              display: 'inline-block',
                            }}
                          >
                            {badge.texto}
                          </span>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                        No hay lotes de producción registrados en el módulo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {reporteActivo === 'pedidos' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID Pedido</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total ($)</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {datosModulos.pedidos.length > 0 ? datosModulos.pedidos.map((pedido) => {
                    const badge = obtenerBadgeEstado(pedido.estado);
                    return (
                      <tr key={pedido.id}>
                        <td>{pedido.codigoVisual}</td>
                        <td>{pedido.cliente}</td>
                        <td>{formatearFecha(pedido.fecha)}</td>
                        <td>{formatearMoneda(pedido.total)}</td>
                        <td>
                          <span
                            style={{
                              backgroundColor: badge.bg,
                              color: badge.color,
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              display: 'inline-block',
                            }}
                          >
                            {badge.texto}
                          </span>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                        No hay pedidos registrados en el módulo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {reporteActivo === 'proveedores' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Proveedor</th>
                    <th>Insumo</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {datosModulos.proveedores.length > 0 ? datosModulos.proveedores.map((prov) => {
                    const badge = obtenerBadgeEstado(prov.estado);
                    return (
                      <tr key={prov.id}>
                        <td>{prov.codigoVisual}</td>
                        <td>{prov.nombre}</td>
                        <td>{prov.insumo}</td>
                        <td>{prov.telefono}</td>
                        <td>{prov.correo}</td>
                        <td>
                          <span
                            style={{
                              backgroundColor: badge.bg,
                              color: badge.color,
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              display: 'inline-block',
                            }}
                          >
                            {badge.texto}
                          </span>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                        No hay proveedores registrados en el módulo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div style={estilos.resumenPie}>
            <span>Total de registros en este informe: {datosModulos[reporteActivo]?.length || 0}</span>
            {reporteActivo === 'pedidos' && (
              <span>Total acumulado en pedidos: {formatearMoneda(totalVentasPedidos)}</span>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}