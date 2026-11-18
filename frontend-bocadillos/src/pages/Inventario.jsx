import React, { useEffect, useState } from 'react';
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
    return { texto: 'Agotado', clase: 'bg-red-100 text-red-800' };
  }
  if (Number(cantidad) <= Number(stockMinimo)) {
    return { texto: 'Stock Bajo', clase: 'bg-orange-100 text-orange-800' };
  }
  return { texto: 'Disponible', clase: 'bg-green-100 text-green-800' };
}

const campoClase = 'w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-[#2D2216] focus:border-[#4A7C59] focus:outline-none focus:ring-1 focus:ring-[#4A7C59]';

export default function Inventario() {
  const [listaProductos, setListaProductos] = useState(leerInventarioGuardado);
  const [productosCatalogo, setProductosCatalogo] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorCatalogo, setErrorCatalogo] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [formDatos, setFormDatos] = useState({
    productoId: '',
    cantidad: '',
    unidad: 'Unidad',
    stockMinimo: '',
    vence: '',
  });

  useEffect(() => {
    let activo = true;

    api.get('/productos')
      .then((response) => {
        if (activo) {
          setProductosCatalogo(Array.isArray(response.data) ? response.data : []);
          setErrorCatalogo('');
        }
      })
      .catch(() => {
        if (activo) setErrorCatalogo('No fue posible cargar el catálogo de productos.');
      })
      .finally(() => {
        if (activo) setCargandoProductos(false);
      });

    return () => {
      activo = false;
    };
  }, []);

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
    setFormDatos({ productoId: '', cantidad: '', unidad: 'Unidad', stockMinimo: '', vence: '' });
    setMostrarModal(true);
  };

  const registrarEntrada = (event) => {
    event.preventDefault();
    const producto = productosCatalogo.find((item) => String(item.id) === formDatos.productoId);
    if (!producto) return;

    const nuevoRegistro = {
      id: globalThis.crypto?.randomUUID?.() ?? `registro-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      codigo: String(producto.id),
      producto: producto.nombre,
      cantidad: Number(formDatos.cantidad),
      unidad: formDatos.unidad,
      stockMinimo: Number(formDatos.stockMinimo),
      vence: formDatos.vence,
    };

    actualizarInventario((anterior) => [...anterior, nuevoRegistro]);
    setRegistroSeleccionado(null);
    setMostrarModal(false);
  };

  const actualizarCampo = (id, campo, valor) => {
    actualizarInventario((anterior) => anterior.map((item) => (
      item.id === id
        ? { ...item, [campo]: campo === 'cantidad' || campo === 'stockMinimo' ? Number(valor) : valor }
        : item
    )));
  };

  const eliminarRegistro = (id) => {
    actualizarInventario((anterior) => anterior.filter((item) => item.id !== id));
    if (registroSeleccionado === id) setRegistroSeleccionado(null);
  };

  return (
    <AppShell activePath="/inventario">
      <section className="content-body text-[#2D2216]">
        <div className="page-title-zone">
          <div className="title-icon bg-[#4A7C59] text-white">
            <span className="material-symbols-outlined size-xl">inventory_2</span>
          </div>
          <div>
            <h2 className="text-[#2D2216]">Gestión de Inventario</h2>
            <p className="subtitle">Control de existencias y vencimientos por lote</p>
          </div>
        </div>

        <div className="action-bar">
          <div className="crud-buttons">
            <button
              type="button"
              className="btn bg-[#4A7C59] text-white hover:bg-[#3c6749]"
              onClick={abrirModal}
            >
              <span className="material-symbols-outlined">add</span> Registrar Entrada
            </button>
            {registroSeleccionado && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => eliminarRegistro(registroSeleccionado)}
              >
                <span className="material-symbols-outlined">delete</span> Eliminar
              </button>
            )}
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
          <p className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {errorCatalogo}
          </p>
        )}

        <div className="table-container overflow-x-auto">
          <table className="data-table min-w-[1050px]">
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
                const seleccionado = registroSeleccionado === item.id;

                return (
                  <tr
                    key={item.id}
                    onClick={() => setRegistroSeleccionado(seleccionado ? null : item.id)}
                    className={seleccionado ? 'bg-green-50' : ''}
                  >
                    <td>{item.codigo}</td>
                    <td>{item.producto}</td>
                    <td>{item.cantidad}</td>
                    <td>
                      <select
                        aria-label={`Unidad de ${item.producto}`}
                        className={campoClase}
                        value={item.unidad}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => actualizarCampo(item.id, 'unidad', event.target.value)}
                      >
                        {UNIDADES.map((unidad) => <option key={unidad} value={unidad}>{unidad}</option>)}
                      </select>
                    </td>
                    <td>
                      <input
                        aria-label={`Stock mínimo de ${item.producto}`}
                        className={`${campoClase} w-24`}
                        type="number"
                        min="0"
                        step="any"
                        value={item.stockMinimo}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => actualizarCampo(item.id, 'stockMinimo', event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        aria-label={`Vencimiento de ${item.producto}`}
                        className={campoClase}
                        type="date"
                        value={item.vence}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => actualizarCampo(item.id, 'vence', event.target.value)}
                      />
                    </td>
                    <td>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${estado.clase}`}>
                        {estado.texto}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="action-btn delete-inline"
                        onClick={(event) => {
                          event.stopPropagation();
                          eliminarRegistro(item.id);
                        }}
                        title="Eliminar entrada"
                        aria-label={`Eliminar entrada de ${item.producto}`}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500">
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
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMostrarModal(false);
          }}
        >
          <div
            className="w-full max-w-xl rounded-lg bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-entrada-inventario"
          >
            <h3 id="titulo-entrada-inventario" className="mb-5 text-xl font-semibold text-[#2D2216]">
              Registrar Entrada
            </h3>
            <form onSubmit={registrarEntrada} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-1 block text-sm font-medium">Producto</span>
                <select
                  className={campoClase}
                  value={formDatos.productoId}
                  onChange={(event) => setFormDatos({ ...formDatos, productoId: event.target.value })}
                  required
                  disabled={cargandoProductos || productosCatalogo.length === 0}
                >
                  <option value="" disabled>
                    {cargandoProductos ? 'Cargando productos...' : 'Selecciona un producto del catálogo'}
                  </option>
                  {productosCatalogo.map((producto) => (
                    <option key={producto.id} value={String(producto.id)}>{producto.nombre}</option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium">Cantidad</span>
                <input
                  className={campoClase}
                  type="number"
                  min="0"
                  step="any"
                  value={formDatos.cantidad}
                  onChange={(event) => setFormDatos({ ...formDatos, cantidad: event.target.value })}
                  required
                />
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium">Unidad</span>
                <select
                  className={campoClase}
                  value={formDatos.unidad}
                  onChange={(event) => setFormDatos({ ...formDatos, unidad: event.target.value })}
                  required
                >
                  {UNIDADES.map((unidad) => <option key={unidad} value={unidad}>{unidad}</option>)}
                </select>
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium">Stock mínimo</span>
                <input
                  className={campoClase}
                  type="number"
                  min="0"
                  step="any"
                  value={formDatos.stockMinimo}
                  onChange={(event) => setFormDatos({ ...formDatos, stockMinimo: event.target.value })}
                  required
                />
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium">Vencimiento del lote</span>
                <input
                  className={campoClase}
                  type="date"
                  value={formDatos.vence}
                  onChange={(event) => setFormDatos({ ...formDatos, vence: event.target.value })}
                  required
                />
              </label>

              <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
                <button type="button" className="btn btn-danger" onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn bg-[#4A7C59] text-white hover:bg-[#3c6749]"
                  disabled={cargandoProductos || productosCatalogo.length === 0}
                >
                  Registrar Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}