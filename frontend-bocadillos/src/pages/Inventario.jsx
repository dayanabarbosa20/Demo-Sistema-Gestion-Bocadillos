import React, { useCallback, useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import api from '../services/api';

const INVENTORY_STORAGE_KEY = 'bocadillos-inventory';
const UNIDADES = ['Caja', 'Unidad', 'Libra', 'Arroba', 'Kilo'];

function leerInventarioGuardado() {
  try {
    const guardado = localStorage.getItem(INVENTORY_STORAGE_KEY);
    const inventario = guardado ? JSON.parse(guardado) : [];

    if (!Array.isArray(inventario)) return [];

    return inventario.map((item, index) => ({
      ...item,
      id: String(item.id ?? item.codigo ?? `registro-${index}`),
      codigo: String(item.codigo ?? item.productoId ?? ''),
      producto: item.producto ?? item.nombre ?? '',
      cantidad: Number(item.cantidad) || 0,
      unidad: UNIDADES.includes(item.unidad) ? item.unidad : 'Unidad',
      stockMinimo: Number(item.stockMinimo) || 0,
      vence: item.vence ?? '',
    }));
  } catch {
    return [];
  }
}

function obtenerEstado(cantidad, stockMinimo) {
  if (Number(cantidad) === 0) {
    return { texto: 'Agotado', bg: '#fee2e2', color: '#991b1b' };
  }
  if (Number(cantidad) <= Number(stockMinimo)) {
    return { texto: 'Stock Bajo', bg: '#ffedd5', color: '#9a3412' };
  }
  return { texto: 'Disponible', bg: '#dcfce7', color: '#166534' };
}

function formatearFecha(fecha) {
  if (!fecha) return '—';
  const [anio, mes, dia] = fecha.split('-');
  return anio && mes && dia ? `${dia}/${mes}/${anio}` : fecha;
}

function formatearCodigo(codigo) {
  const texto = String(codigo ?? '').trim();
  return /^\d+$/.test(texto) ? texto.padStart(3, '0') : texto;
}

const estilos = {
  botonVerde: {
    backgroundColor: '#115c36',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 18px',
    fontSize: '0.9rem',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '410px',
    padding: '24px 28px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
  modalTitulo: {
    margin: '0 0 18px 0',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#1a202c',
  },
  formularioVertical: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  grupoCampo: {
    display: 'flex',
    flexDirection: 'column',
  },
  filaEtiqueta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  etiqueta: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#374151',
    marginBottom: '6px',
  },
  enlaceModo: {
    background: 'none',
    border: 'none',
    padding: 0,
    color: '#115c36',
    fontSize: '0.8rem',
    fontWeight: 600,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '0.9rem',
    color: '#1f2937',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '8px',
  },
  alertaError: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    padding: '9px 12px',
    fontSize: '0.85rem',
    marginBottom: '14px',
  },
  alertaAviso: {
    backgroundColor: '#fffbeb',
    color: '#92400e',
    border: '1px solid #fde68a',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '0.85rem',
    marginBottom: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
};

export default function Inventario() {
  const [listaProductos, setListaProductos] = useState(leerInventarioGuardado);
  const [productosCatalogo, setProductosCatalogo] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorCatalogo, setErrorCatalogo] = useState('');
  const [errorFormulario, setErrorFormulario] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [registroEditandoId, setRegistroEditandoId] = useState(null);
  const [modoManual, setModoManual] = useState(false);
  const [formDatos, setFormDatos] = useState({
    productoId: '',
    codigoManual: '',
    nombreManual: '',
    cantidad: '',
    unidad: 'Unidad',
    stockMinimo: '0',
    vence: '',
  });

  const cargarCatalogo = useCallback(async () => {
    setCargandoProductos(true);
    setErrorCatalogo('');
    try {
      const response = await api.get('/productos');
      const datos = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.content)
          ? response.data.content
          : Array.isArray(response.data?.data)
            ? response.data.data
            : [];
      setProductosCatalogo(datos);
    } catch {
      setErrorCatalogo('No fue posible cargar el catálogo desde el servidor. Puedes reintentar o ingresar el producto manualmente.');
    } finally {
      setCargandoProductos(false);
    }
  }, []);

  useEffect(() => {
    cargarCatalogo();
  }, [cargarCatalogo]);

  const actualizarInventario = (actualizador) => {
    setListaProductos((anterior) => {
      const siguiente = actualizador(anterior);
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(siguiente));
      return siguiente;
    });
  };

  const productosFiltrados = listaProductos.filter((item) =>
    `${item.producto} ${item.codigo}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirModal = () => {
    setRegistroEditandoId(null);
    setErrorFormulario('');
    setModoManual(false);
    setFormDatos({
      productoId: '',
      codigoManual: '',
      nombreManual: '',
      cantidad: '',
      unidad: 'Unidad',
      stockMinimo: '0',
      vence: '',
    });
    setMostrarModal(true);

    if (productosCatalogo.length === 0 && !cargandoProductos) {
      cargarCatalogo();
    }
  };

  const abrirEdicion = (registro) => {
    setRegistroEditandoId(registro.id);
    setErrorFormulario('');

    const coincidenciaCatalogo = productosCatalogo.find(
      (p) => String(p.id) === String(registro.codigo) || Number(p.id) === Number(registro.codigo)
    );

    setModoManual(!coincidenciaCatalogo);
    setFormDatos({
      productoId: coincidenciaCatalogo ? String(coincidenciaCatalogo.id) : '',
      codigoManual: registro.codigo,
      nombreManual: registro.producto,
      cantidad: String(registro.cantidad),
      unidad: registro.unidad,
      stockMinimo: String(registro.stockMinimo),
      vence: registro.vence || '',
    });
    setMostrarModal(true);
  };

  const guardarEntrada = (event) => {
    event.preventDefault();
    setErrorFormulario('');

    let codigoFinal = '';
    let nombreFinal = '';

    if (modoManual || productosCatalogo.length === 0) {
      codigoFinal = formatearCodigo(formDatos.codigoManual);
      nombreFinal = formDatos.nombreManual.trim();
      if (!codigoFinal || !nombreFinal) {
        setErrorFormulario('Ingresa el código y el nombre del producto.');
        return;
      }
    } else {
      const producto = productosCatalogo.find(
        (item) => String(item.id) === String(formDatos.productoId) || Number(item.id) === Number(formDatos.productoId)
      );
      if (!producto) {
        setErrorFormulario('Selecciona un producto válido del catálogo.');
        return;
      }
      codigoFinal = formatearCodigo(producto.id);
      nombreFinal = producto.nombre;
    }

    const datosRegistro = {
      codigo: codigoFinal,
      producto: nombreFinal,
      cantidad: Number(formDatos.cantidad),
      unidad: formDatos.unidad,
      stockMinimo: Number(formDatos.stockMinimo) || 0,
      vence: formDatos.vence,
    };

    if (registroEditandoId) {
      actualizarInventario((anterior) =>
        anterior.map((item) => (item.id === registroEditandoId ? { ...item, ...datosRegistro } : item))
      );
    } else {
      const nuevoRegistro = {
        ...datosRegistro,
        id: globalThis.crypto?.randomUUID?.() ?? `registro-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };
      actualizarInventario((anterior) => [...anterior, nuevoRegistro]);
    }

    setRegistroEditandoId(null);
    setMostrarModal(false);
  };

  const eliminarRegistro = (id) => {
    actualizarInventario((anterior) => anterior.filter((item) => item.id !== id));
  };

  const usarEntradaManual = modoManual || (!cargandoProductos && productosCatalogo.length === 0);

  return (
    <AppShell activePath="/inventario">
      <section className="content-body">
        <div className="page-title-zone">
          <div className="title-icon">
            <span className="material-symbols-outlined size-xl">inventory_2</span>
          </div>
          <div>
            <h2>Gestión de Inventario</h2>
            <p className="subtitle">Control de existencias y vencimientos por lote</p>
          </div>
        </div>

        <div className="action-bar">
          <div className="crud-buttons">
            <button
              type="button"
              className="btn"
              style={estilos.botonVerde}
              onClick={abrirModal}
            >
              <span className="material-symbols-outlined">add</span> Registrar Entrada
            </button>
          </div>

          <div className="search-box">
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="search"
              placeholder="Buscar producto o código..."
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </div>
        </div>

        {errorCatalogo && (
          <div style={estilos.alertaAviso} role="alert">
            <span>{errorCatalogo}</span>
            <button
              type="button"
              style={estilos.enlaceModo}
              onClick={cargarCatalogo}
              disabled={cargandoProductos}
            >
              {cargandoProductos ? 'Cargando...' : 'Reintentar'}
            </button>
          </div>
        )}

        <div className="table-container" style={{ overflowX: 'auto' }}>
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.length > 0 ? productosFiltrados.map((item) => {
                const estado = obtenerEstado(item.cantidad, item.stockMinimo);
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
                        className="badge"
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
                    <td>
                      <button
                        type="button"
                        className="action-btn edit-inline"
                        onClick={() => abrirEdicion(item)}
                        title="Editar entrada"
                        aria-label={`Editar entrada de ${item.producto}`}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        type="button"
                        className="action-btn delete-inline"
                        onClick={() => eliminarRegistro(item.id)}
                        title="Borrar entrada"
                        aria-label={`Borrar entrada de ${item.producto}`}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="8" style={{ padding: '28px', textAlign: 'center', color: '#6b7280' }}>
                    {listaProductos.length === 0
                      ? 'No hay entradas de inventario registradas.'
                      : 'No se encontraron productos que coincidan con la búsqueda.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="table-footer">
          <span>Mostrando {productosFiltrados.length} de {listaProductos.length} entradas</span>
        </footer>
      </section>

      {mostrarModal && (
        <div
          style={estilos.overlay}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMostrarModal(false);
          }}
        >
          <div
            style={estilos.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-entrada-inventario"
          >
            <h3 id="titulo-entrada-inventario" style={estilos.modalTitulo}>
              {registroEditandoId ? 'Editar Entrada' : 'Registrar Entrada'}
            </h3>

            {errorFormulario && (
              <div style={estilos.alertaError} role="alert">
                {errorFormulario}
              </div>
            )}

            <form onSubmit={guardarEntrada} style={estilos.formularioVertical}>
              {!usarEntradaManual ? (
                <div style={estilos.grupoCampo}>
                  <div style={estilos.filaEtiqueta}>
                    <label htmlFor="select-producto" style={{ ...estilos.etiqueta, marginBottom: 0 }}>
                      Producto
                    </label>
                    {productosCatalogo.length > 0 && (
                      <button
                        type="button"
                        style={estilos.enlaceModo}
                        onClick={() => setModoManual(true)}
                      >
                        Ingresar manual
                      </button>
                    )}
                  </div>
                  <select
                    id="select-producto"
                    style={estilos.input}
                    value={formDatos.productoId}
                    onChange={(event) => setFormDatos({ ...formDatos, productoId: event.target.value })}
                    required
                    disabled={cargandoProductos}
                  >
                    <option value="" disabled>
                      {cargandoProductos ? 'Cargando productos...' : 'Selecciona un producto'}
                    </option>
                    {productosCatalogo.map((producto) => (
                      <option key={producto.id} value={String(producto.id)}>
                        {formatearCodigo(producto.id)} - {producto.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div style={estilos.grupoCampo}>
                    <div style={estilos.filaEtiqueta}>
                      <label htmlFor="input-codigo" style={{ ...estilos.etiqueta, marginBottom: 0 }}>
                        Código
                      </label>
                      {productosCatalogo.length > 0 && (
                        <button
                          type="button"
                          style={estilos.enlaceModo}
                          onClick={() => setModoManual(false)}
                        >
                          Elegir del catálogo
                        </button>
                      )}
                    </div>
                    <input
                      id="input-codigo"
                      style={estilos.input}
                      type="text"
                      placeholder="Ej. 003"
                      value={formDatos.codigoManual}
                      onChange={(event) => setFormDatos({ ...formDatos, codigoManual: event.target.value })}
                      required
                    />
                  </div>

                  <div style={estilos.grupoCampo}>
                    <label htmlFor="input-nombre" style={estilos.etiqueta}>Nombre del producto</label>
                    <input
                      id="input-nombre"
                      style={estilos.input}
                      type="text"
                      placeholder="Ej. Bocadillo Veleño x12"
                      value={formDatos.nombreManual}
                      onChange={(event) => setFormDatos({ ...formDatos, nombreManual: event.target.value })}
                      required
                    />
                  </div>
                </>
              )}

              <div style={estilos.grupoCampo}>
                <label htmlFor="input-cantidad" style={estilos.etiqueta}>Cantidad</label>
                <input
                  id="input-cantidad"
                  style={estilos.input}
                  type="number"
                  min="0"
                  step="any"
                  value={formDatos.cantidad}
                  onChange={(event) => setFormDatos({ ...formDatos, cantidad: event.target.value })}
                  required
                />
              </div>

              <div style={estilos.grupoCampo}>
                <label htmlFor="select-unidad" style={estilos.etiqueta}>Unidad</label>
                <select
                  id="select-unidad"
                  style={estilos.input}
                  value={formDatos.unidad}
                  onChange={(event) => setFormDatos({ ...formDatos, unidad: event.target.value })}
                  required
                >
                  {UNIDADES.map((unidad) => (
                    <option key={unidad} value={unidad}>{unidad}</option>
                  ))}
                </select>
              </div>

              <div style={estilos.grupoCampo}>
                <label htmlFor="input-stock-min" style={estilos.etiqueta}>Stock mínimo</label>
                <input
                  id="input-stock-min"
                  style={estilos.input}
                  type="number"
                  min="0"
                  step="any"
                  value={formDatos.stockMinimo}
                  onChange={(event) => setFormDatos({ ...formDatos, stockMinimo: event.target.value })}
                />
              </div>

              <div style={estilos.grupoCampo}>
                <label htmlFor="input-vence" style={estilos.etiqueta}>Vencimiento del lote (opcional)</label>
                <input
                  id="input-vence"
                  style={estilos.input}
                  type="date"
                  value={formDatos.vence}
                  onChange={(event) => setFormDatos({ ...formDatos, vence: event.target.value })}
                />
              </div>

              <div style={estilos.modalFooter}>
                <button type="button" className="btn btn-danger" onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn"
                  style={estilos.botonVerde}
                  disabled={cargandoProductos && !usarEntradaManual}
                >
                  Guardar Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}