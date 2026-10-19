import React, { useState } from 'react';
import AppShell from '../components/AppShell';

// Datos iniciales
const datosIniciales = [
  { codigo: '001', producto: 'Bocadillo Veleño', cantidad: 100, estado: 'Disponible', estadoClass: 'status-available' },
  { codigo: '002', producto: 'Guayaba', cantidad: 50, estado: 'Disponible', estadoClass: 'status-available' },
  { codigo: '003', producto: 'Azúcar', cantidad: 30, estado: 'Bajo Stock', estadoClass: 'status-low-stock' },
];

export default function Inventario() {
  // Estados para manejar los datos y la UI
  const [listaProductos, setListaProductos] = useState(datosIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
  // Estado para controlar el modal de formulario
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formDatos, setFormDatos] = useState({
    codigo: '',
    producto: '',
    cantidad: '',
    estado: 'Disponible'
  });

  // --- BUSCADOR EN TIEMPO REAL ---
  const productosFiltrados = listaProductos.filter((item) =>
    item.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.codigo.includes(busqueda)
  );

  // --- SELECCIÓN DE FILA ---
  const seleccionarFila = (producto) => {
    if (productoSeleccionado?.codigo === producto.codigo) {
      setProductoSeleccionado(null); // Deselecciona si vuelve a dar clic
    } else {
      setProductoSeleccionado(producto);
    }
  };

  // --- ABRIR MODAL CREAR ---
  const handleAbrirCrear = () => {
    setModoEdicion(false);
    setFormDatos({ codigo: '', producto: '', cantidad: '', estado: 'Disponible' });
    setMostrarModal(true);
  };

  // --- ABRIR MODAL EDITAR ---
  const handleAbrirEditar = (prod = productoSeleccionado) => {
    if (!prod) {
      alert('Por favor selecciona un producto para editar.');
      return;
    }
    setModoEdicion(true);
    setFormDatos({ ...prod });
    setMostrarModal(true);
  };

  // --- ELIMINAR PRODUCTO ---
  const handleEliminar = (codigoEliminar = productoSeleccionado?.codigo) => {
    if (!codigoEliminar) {
      alert('Por favor selecciona un producto para eliminar.');
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar el producto ${codigoEliminar}?`)) {
      setListaProductos(prev => prev.filter(p => p.codigo !== codigoEliminar));
      if (productoSeleccionado?.codigo === codigoEliminar) {
        setProductoSeleccionado(null);
      }
    }
  };

  // --- GUARDAR PRODUCTO (CREAR / EDITAR) ---
  const handleGuardar = (e) => {
    e.preventDefault();
    if (!formDatos.codigo || !formDatos.producto || !formDatos.cantidad) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const estadoClass = Number(formDatos.cantidad) <= 30 ? 'status-low-stock' : 'status-available';
    const estadoTexto = Number(formDatos.cantidad) <= 30 ? 'Bajo Stock' : 'Disponible';

    if (modoEdicion) {
      // Actualizar producto existente
      setListaProductos(prev =>
        prev.map(p => p.codigo === formDatos.codigo ? {
          ...formDatos,
          cantidad: Number(formDatos.cantidad),
          estado: estadoTexto,
          estadoClass
        } : p)
      );
    } else {
      // Validar si el código ya existe
      if (listaProductos.some(p => p.codigo === formDatos.codigo)) {
        alert('El código del producto ya existe. Utiliza otro diferente.');
        return;
      }
      // Agregar nuevo producto
      const nuevo = {
        ...formDatos,
        cantidad: Number(formDatos.cantidad),
        estado: estadoTexto,
        estadoClass
      };
      setListaProductos(prev => [...prev, nuevo]);
    }

    setMostrarModal(false);
  };

  return (
    <AppShell activePath="/inventario">
      <section className="content-body">
        {/* TÍTULO DE LA PÁGINA */}
        <div className="page-title-zone">
          <div className="title-icon">
            <span className="material-symbols-outlined size-xl">inventory_2</span>
          </div>
          <div>
            <h2>Gestión de Inventario</h2>
            <p className="subtitle">Administra los productos y existencias de la fábrica</p>
          </div>
        </div>

        {/* BARRA DE ACCIONES (ACCIONES CRUD Y BÚSQUEDA) */}
        <div className="action-bar">
          <div className="crud-buttons">
            <button type="button" className="btn btn-success" onClick={handleAbrirCrear}>
              <span className="material-symbols-outlined">add</span> Agregar Producto
            </button>
            <button 
              type="button" 
              className={`btn btn-info ${!productoSeleccionado ? 'opacity-50' : ''}`}
              onClick={() => handleAbrirEditar()}
            >
              <span className="material-symbols-outlined">edit</span> Editar
            </button>
            <button 
              type="button" 
              className={`btn btn-danger ${!productoSeleccionado ? 'opacity-50' : ''}`}
              onClick={() => handleEliminar()}
            >
              <span className="material-symbols-outlined">delete</span> Eliminar
            </button>
          </div>

          <div className="search-box">
            <span className="material-symbols-outlined search-icon">search</span>
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* TABLA DE PRODUCTOS */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((item) => {
                  const esSeleccionado = productoSeleccionado?.codigo === item.codigo;
                  return (
                    <tr 
                      key={item.codigo} 
                      onClick={() => seleccionarFila(item)}
                      style={{
                        backgroundColor: esSeleccionado ? 'rgba(46, 125, 50, 0.1)' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <td>{item.codigo}</td>
                      <td>{item.producto}</td>
                      <td>{item.cantidad}</td>
                      <td>
                        <span className={`badge ${item.estadoClass}`}>{item.estado}</span>
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
                            handleEliminar(item.codigo);
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
                    No se encontraron productos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER DE LA TABLA */}
        <footer className="table-footer">
          <span>Mostrando {productosFiltrados.length} de {listaProductos.length} productos</span>
          <div className="pagination">
            <button type="button" className="page-nav">&lt;</button>
            <button type="button" className="page-num active">1</button>
            <button type="button" className="page-nav">&gt;</button>
          </div>
        </footer>
      </section>

      {/* MODAL / FORMULARIO CREAR Y EDITAR PRODUCTO */}
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
              {modoEdicion ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </h3>
            
            <form onSubmit={handleGuardar}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Código</label>
                <input 
                  type="text"
                  disabled={modoEdicion}
                  value={formDatos.codigo}
                  onChange={(e) => setFormDatos({...formDatos, codigo: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="Ej: 004"
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Nombre del Producto</label>
                <input 
                  type="text"
                  value={formDatos.producto}
                  onChange={(e) => setFormDatos({...formDatos, producto: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="Ej: Bocadillo de Arequipe"
                  required
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Cantidad Existente</label>
                <input 
                  type="number"
                  value={formDatos.cantidad}
                  onChange={(e) => setFormDatos({...formDatos, cantidad: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="Ej: 80"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  {modoEdicion ? 'Guardar Cambios' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}