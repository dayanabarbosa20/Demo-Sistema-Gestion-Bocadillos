import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import api from '../services/api';

export default function Proveedores() {
  const [listaProveedores, setListaProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [errorCarga, setErrorCarga] = useState('');

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nombreAnterior, setNombreAnterior] = useState('');
  const [formDatos, setFormDatos] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    estado: 'Activo'
  });

  const cargarProveedores = async () => {
    try {
      const response = await api.get('/proveedores');
      setListaProveedores(response.data);
      setErrorCarga('');
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
      setErrorCarga('No se pudieron cargar los proveedores. Verifica que el backend esté activo.');
    }
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  const obtenerEstadoClass = (estado) => {
    return estado === 'Activo' ? 'status-active' : 'status-inactive';
  };

  const proveedoresFiltrados = listaProveedores.filter((item) =>
    item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
    String(item.telefono).includes(busqueda)
  );

  const seleccionarFila = (item) => {
    if (proveedorSeleccionado?.nombre === item.nombre) {
      setProveedorSeleccionado(null);
    } else {
      setProveedorSeleccionado(item);
    }
  };

  const handleAbrirCrear = () => {
    setModoEdicion(false);
    setFormDatos({ nombre: '', telefono: '', correo: '', estado: 'Activo' });
    setMostrarModal(true);
  };

  const handleAbrirEditar = (item = proveedorSeleccionado) => {
    if (!item) {
      alert('Por favor selecciona un proveedor para editar.');
      return;
    }
    setModoEdicion(true);
    setNombreAnterior(item.nombre);
    setFormDatos({ ...item });
    setMostrarModal(true);
  };

  const handleEliminar = async (nombreEliminar = proveedorSeleccionado?.nombre) => {
    if (!nombreEliminar) {
      alert('Por favor selecciona un proveedor para eliminar.');
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar a "${nombreEliminar}"?`)) {
      try {
        await api.delete(`/proveedores/${encodeURIComponent(nombreEliminar)}`);
        setProveedorSeleccionado(null);
        await cargarProveedores();
      } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        alert('No se pudo eliminar el proveedor.');
      }
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!formDatos.nombre || !formDatos.telefono || !formDatos.correo) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const datosProveedor = {
      nombre: formDatos.nombre.trim(),
      telefono: formDatos.telefono.trim(),
      correo: formDatos.correo.trim(),
      estado: formDatos.estado
    };

    if (listaProveedores.some((item) =>
      item.nombre.toLowerCase() === datosProveedor.nombre.toLowerCase() &&
      (!modoEdicion || item.nombre !== nombreAnterior)
    )) {
      alert('Ya existe un proveedor con este nombre.');
      return;
    }

    try {
      if (modoEdicion) {
        await api.put(`/proveedores/${encodeURIComponent(nombreAnterior)}`, datosProveedor);
      } else {
        await api.post('/proveedores', datosProveedor);
      }
      setMostrarModal(false);
      setProveedorSeleccionado(null);
      await cargarProveedores();
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
      alert('No se pudo guardar el proveedor.');
    }
  };

  return (
    <AppShell activePath="/proveedores">
      <section className="content-body">
        {/* ENCABEZADO */}
        <div className="page-title-zone">
          <div className="title-icon">
            <span className="material-symbols-outlined size-xl">local_shipping</span>
          </div>
          <div>
            <h2>Gestión de Proveedores</h2>
            <p className="subtitle">Administra la información de los proveedores de la fábrica</p>
          </div>
        </div>

        {/* BARRA DE ACCIONES Y BÚSQUEDA */}
        <div className="action-bar">
          <div className="crud-buttons">
            <button type="button" className="btn btn-success" onClick={handleAbrirCrear}>
              <span className="material-symbols-outlined">add</span> Nuevo Proveedor
            </button>
            <button 
              type="button" 
              className="btn btn-info" 
              disabled={!proveedorSeleccionado}
              onClick={() => handleAbrirEditar()}
            >
              <span className="material-symbols-outlined">edit</span> Editar
            </button>
            <button 
              type="button" 
              className="btn btn-danger" 
              disabled={!proveedorSeleccionado}
              onClick={() => handleEliminar()}
            >
              <span className="material-symbols-outlined">delete</span> Eliminar
            </button>
          </div>

          <div className="search-box">
            <span className="material-symbols-outlined search-icon">search</span>
            <input 
              type="text" 
              placeholder="Buscar Proveedor..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* TABLA DE PROVEEDORES */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Proveedor</th>
                <th>Telefono</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedoresFiltrados.length > 0 ? (
                proveedoresFiltrados.map((item) => {
                  const esSeleccionado = proveedorSeleccionado?.nombre === item.nombre;
                  return (
                    <tr 
                      key={item.nombre}
                      onClick={() => seleccionarFila(item)}
                      style={{
                        backgroundColor: esSeleccionado ? 'rgba(46, 125, 50, 0.1)' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <td>{item.nombre}</td>
                      <td>{item.telefono}</td>
                      <td>{item.correo}</td>
                      <td>
                        <span className={`badge ${obtenerEstadoClass(item.estado)}`}>{item.estado}</span>
                      </td>
                      <td>
                        <button 
                          type="button" 
                          className="action-btn edit-inline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAbrirEditar(item);
                          }}
                          title="Editar"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button 
                          type="button" 
                          className="action-btn delete-inline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEliminar(item.nombre);
                          }}
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
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    {errorCarga || (listaProveedores.length === 0
                      ? 'No hay proveedores registrados.'
                      : 'No se encontraron proveedores.')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PIE DE TABLA */}
        <footer className="table-footer">
          <span>Mostrando {proveedoresFiltrados.length} de {listaProveedores.length} Proveedores</span>
          <div className="pagination">
            <button type="button" className="page-nav">&lt;</button>
            <button type="button" className="page-num active">1</button>
            <button type="button" className="page-nav">&gt;</button>
          </div>
        </footer>
      </section>

      {/* MODAL PARA CREAR Y EDITAR */}
      {mostrarModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '25px',
            width: '400px',
            maxWidth: '90%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#1B4332' }}>
              {modoEdicion ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </h3>
            
            <form onSubmit={handleGuardar}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Nombre del Proveedor</label>
                <input 
                  type="text"
                  value={formDatos.nombre}
                  onChange={(e) => setFormDatos({...formDatos, nombre: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="Ej: Lácteos el Valle"
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Teléfono</label>
                <input 
                  type="text"
                  value={formDatos.telefono}
                  onChange={(e) => setFormDatos({...formDatos, telefono: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="Ej: 3171234567"
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Correo Electrónico</label>
                <input 
                  type="email"
                  value={formDatos.correo}
                  onChange={(e) => setFormDatos({...formDatos, correo: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="Ej: contacto@ejemplo.com"
                  required
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Estado</label>
                <select 
                  value={formDatos.estado}
                  onChange={(e) => setFormDatos({...formDatos, estado: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => {
                    setMostrarModal(false);
                    setProveedorSeleccionado(null);
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  {modoEdicion ? 'Guardar Cambios' : 'Crear Proveedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}