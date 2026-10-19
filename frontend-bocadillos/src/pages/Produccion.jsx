import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import api from '../services/api';

export default function Produccion() {
  const [listaLotes, setListaLotes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [produccionEditando, setProduccionEditando] = useState(null);
  const [formDatos, setFormDatos] = useState({
    cantidad: '',
    codigoLote: '',
    estado: 'Pendiente',
    fecha: '',
    idProducto: '',
  });

  const cargarProduccion = async () => {
    try {
      const response = await api.get('/produccion');
      setListaLotes(Array.isArray(response.data) ? response.data : []);
      setError('');
    } catch (requestError) {
      console.error('Error al cargar producción:', requestError);
      setError('No se pudo cargar la producción. Verifica que el backend esté activo.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProduccion();
    api.get('/productos')
      .then((response) => setProductos(Array.isArray(response.data) ? response.data : []))
      .catch((requestError) => console.error('Error al cargar productos para producción:', requestError));
  }, []);

  const abrirCrear = () => {
    setProduccionEditando(null);
    setFormDatos({ cantidad: '', codigoLote: '', estado: 'Pendiente', fecha: '', idProducto: '' });
    setMostrarModal(true);
  };

  const abrirEditar = (item) => {
    setProduccionEditando(item);
    setFormDatos({
      cantidad: String(item.cantidad ?? ''),
      codigoLote: item.codigoLote ?? '',
      estado: item.estado ?? 'Pendiente',
      fecha: item.fecha ?? '',
      idProducto: String(item.producto?.id ?? ''),
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setProduccionEditando(null);
  };

  const guardarProduccion = async (event) => {
    event.preventDefault();
    const datosProduccion = {
      cantidad: Number(formDatos.cantidad),
      codigoLote: formDatos.codigoLote,
      estado: formDatos.estado,
      fecha: formDatos.fecha,
      producto: { id: Number(formDatos.idProducto) },
    };

    try {
      if (produccionEditando) {
        await api.put(`/produccion/${produccionEditando.idProduccion}`, datosProduccion);
      } else {
        await api.post('/produccion', datosProduccion);
      }
      cerrarModal();
      await cargarProduccion();
    } catch (requestError) {
      console.error('Error al guardar producción:', requestError);
      window.alert(requestError.response?.data || 'No se pudo guardar el registro de producción.');
    }
  };

  const eliminarProduccion = async (item) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el lote ${item.codigoLote}?`)) return;
    try {
      await api.delete(`/produccion/${item.idProduccion}`);
      await cargarProduccion();
    } catch (requestError) {
      console.error('Error al eliminar producción:', requestError);
      window.alert(requestError.response?.data || 'No se pudo eliminar el registro de producción.');
    }
  };

  const obtenerEstadoClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'en proceso': return 'status-in-progress';
      case 'finalizado': return 'status-finished';
      default: return 'status-pending';
    }
  };

  const consulta = busqueda.toLowerCase();
  const lotesFiltrados = listaLotes.filter((item) => [
    item.codigoLote,
    item.estado,
    item.fecha,
    item.idProduccion,
    item.producto?.id,
    item.producto?.nombre,
    item.cantidad,
  ].some((valor) => String(valor ?? '').toLowerCase().includes(consulta)));

  return (
    <AppShell activePath="/produccion">
      <section className="content-body">
        {/* TÍTULO DE LA PÁGINA */}
        <div className="page-title-zone">
          <div className="title-icon">
            <span className="material-symbols-outlined size-xl">deployed_code</span>
          </div>
          <div>
            <h2>Gestión de Producción</h2>
            <p className="subtitle">Administra los lotes de producción de la fábrica</p>
          </div>
        </div>

        {/* BARRA DE ACCIONES */}
        <div className="action-bar">
          <div className="crud-buttons">
            <button type="button" className="btn btn-success" onClick={abrirCrear}>
              <span className="material-symbols-outlined">add</span> Nuevo Lote
            </button>
          </div>
          <div className="search-box">
            <span className="material-symbols-outlined search-icon">search</span>
            <input 
              type="text" 
              placeholder="Buscar lote..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* TABLA DE LOTES */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Código de lote</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>ID producción</th>
                <th>ID producto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Cargando producción...</td></tr>
              ) : error ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>{error}</td></tr>
              ) : lotesFiltrados.length > 0 ? (
                lotesFiltrados.map((item) => {
                  return (
                    <tr key={item.idProduccion}>
                      <td>{item.cantidad}</td>
                      <td>{item.codigoLote}</td>
                      <td>
                        <span className={`badge ${obtenerEstadoClass(item.estado)}`}>{item.estado}</span>
                      </td>
                      <td>{item.fecha ?? '-'}</td>
                      <td>{item.idProduccion}</td>
                      <td>
                        {item.producto?.id ?? '-'}
                        {item.producto?.nombre ? ` - ${item.producto.nombre}` : ''}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="action-btn edit-inline"
                          onClick={() => abrirEditar(item)}
                          title="Editar"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                          type="button"
                          className="action-btn delete-inline"
                          onClick={() => eliminarProduccion(item)}
                          title="Eliminar"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                    {listaLotes.length === 0
                      ? 'No hay registros de producción.'
                      : 'No se encontraron registros que coincidan con la búsqueda.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PIE DE TABLA */}
        <footer className="table-footer">
          <span>Mostrando {lotesFiltrados.length} de {listaLotes.length} registros</span>
        </footer>
      </section>

        {mostrarModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '25px',
              width: '440px',
              maxWidth: '90%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}>
              <h3 style={{ marginBottom: '15px', color: '#1B4332' }}>
                {produccionEditando ? 'Editar Producción' : 'Nuevo Lote de Producción'}
              </h3>
              <form onSubmit={guardarProduccion}>
                <div style={{ marginBottom: '12px' }}>
                  <label htmlFor="codigoLote" style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Código de lote</label>
                  <input
                    id="codigoLote"
                    type="text"
                    value={formDatos.codigoLote}
                    onChange={(event) => setFormDatos({ ...formDatos, codigoLote: event.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label htmlFor="productoProduccion" style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Producto</label>
                  <select
                    id="productoProduccion"
                    value={formDatos.idProducto}
                    onChange={(event) => setFormDatos({ ...formDatos, idProducto: event.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    required
                  >
                    <option value="">Selecciona un producto</option>
                    {productos.map((producto) => (
                      <option key={producto.id} value={producto.id}>
                        {producto.id} - {producto.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label htmlFor="cantidadProduccion" style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Cantidad</label>
                  <input
                    id="cantidadProduccion"
                    type="number"
                    min="1"
                    value={formDatos.cantidad}
                    onChange={(event) => setFormDatos({ ...formDatos, cantidad: event.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label htmlFor="estadoProduccion" style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Estado</label>
                  <select
                    id="estadoProduccion"
                    value={formDatos.estado}
                    onChange={(event) => setFormDatos({ ...formDatos, estado: event.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <label htmlFor="fechaProduccion" style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Fecha</label>
                  <input
                    id="fechaProduccion"
                    type="date"
                    value={formDatos.fecha}
                    onChange={(event) => setFormDatos({ ...formDatos, fecha: event.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn btn-danger" onClick={cerrarModal}>Cancelar</button>
                  <button type="submit" className="btn btn-success">
                    {produccionEditando ? 'Guardar Cambios' : 'Crear Lote'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

    </AppShell>
  );
}