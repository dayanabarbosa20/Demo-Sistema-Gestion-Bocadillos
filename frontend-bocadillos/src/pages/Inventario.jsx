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
    return { texto: 'Agotado', clase: 'bg-red-100 text-red-800' };
  }
  if (Number(cantidad) <= Number(stockMinimo)) {
    return { texto: 'Stock Bajo', clase: 'bg-orange-100 text-orange-800' };
  }
  return { texto: 'Disponible', clase: 'bg-green-100 text-green-800' };
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

const campoClase = 'w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-[#2D2216] focus:border-[#14532d] focus:outline-none focus:ring-1 focus:ring-[#14532d]';

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
      <section className="content-body text-[#2D2216]">
        <div className="page-title-zone">
          <div className="title-icon">
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
              className="btn btn-primary"
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
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
            <span>{errorCatalogo}</span>
            <button
              type="button"
              className="rounded border border-amber-400 bg-white px-2.5 py-1 text-xs font-medium text-amber-900 hover:bg-amber-100"
              onClick={cargarCatalogo}
              disabled={cargandoProductos}
            >
              {cargandoProductos ? 'Cargando...' : 'Reintentar'}
            </button>
          </div>
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
                return (
                  <tr key={item.id}>
                    <td>{item.codigo}</td>
                    <td>{item.producto}</td>
                    <td>{item.cantidad}</td>
                    <td>{item.unidad}</td>
                    <td>{item.stockMinimo}</td>
                    <td>{formatearFecha(item.vence)}</td>
                    <td>
                      <span className={`badge ${estado.clase}`}>
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
            <div className="mb-5 flex items-center justify-between gap-2">
              <h3 id="titulo-entrada-inventario" className="text-xl font-semibold text-[#2D2216]">
                {registroEditandoId ? 'Editar Entrada de Inventario' : 'Registrar Entrada de Inventario'}
              </h3>

              {productosCatalogo.length > 0 && (
                <button
                  type="button"
                  className="text-xs font-medium text-[#14532d] underline hover:opacity-80"
                  onClick={() => setModoManual((prev) => !prev)}
                >
                  {modoManual ? 'Seleccionar del catálogo' : 'Ingresar manualmente'}
                </button>
              )}
            </div>

            {errorFormulario && (
              <p className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                {errorFormulario}
              </p>
            )}

            <form onSubmit={guardarEntrada} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {!usarEntradaManual ? (
                <label className="sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium">Producto</span>
                  <select
                    className={campoClase}
                    value={formDatos.productoId}
                    onChange={(event) => setFormDatos({ ...formDatos, productoId: event.target.value })}
                    required
                    disabled={cargandoProductos}
                  >
                    <option value="" disabled>
                      {cargandoProductos ? 'Cargando productos del catálogo...' : 'Selecciona un producto del catálogo'}
                    </option>
                    {productosCatalogo.map((producto) => (
                      <option key={producto.id} value={String(producto.id)}>
                        {formatearCodigo(producto.id)} - {producto.nombre}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <>
                  <label>
                    <span className="mb-1 block text-sm font-medium">Código</span>
                    <input
                      className={campoClase}
                      type="text"
                      placeholder="Ej. 003"
                      value={formDatos.codigoManual}
                      onChange={(event) => setFormDatos({ ...formDatos, codigoManual: event.target.value })}
                      required
                    />
                  </label>

                  <label>
                    <span className="mb-1 block text-sm font-medium">Nombre del producto</span>
                    <input
                      className={campoClase}
                      type="text"
                      placeholder="Ej. Bocadillo Veleño x12"
                      value={formDatos.nombreManual}
                      onChange={(event) => setFormDatos({ ...formDatos, nombreManual: event.target.value })}
                      required
                    />
                  </label>
                </>
              )}

              <label>
                <span className="mb-1 block text-sm font-medium">Cantidad</span>
                <input
                  className={campoClase}
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
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
                  {UNIDADES.map((unidad) => (
                    <option key={unidad} value={unidad}>{unidad}</option>
                  ))}
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
                />
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium">Vencimiento del lote (opcional)</span>
                <input
                  className={campoClase}
                  type="date"
                  value={formDatos.vence}
                  onChange={(event) => setFormDatos({ ...formDatos, vence: event.target.value })}
                />
              </label>

              <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
                <button type="button" className="btn btn-danger" onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
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