import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import api from '../services/api';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  const cargarProductos = async () => {
    try {
      const response = await api.get('/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    String(producto.id).includes(busqueda)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const datosProducto = {
        nombre,
        precio: parseFloat(precio),
        cantidad: productoEditando?.cantidad ?? null,
      };

      if (productoEditando) {
        await api.put(`/productos/${productoEditando.id}`, datosProducto);
      } else {
        await api.post('/productos', datosProducto);
      }
      setNombre('');
      setPrecio('');
      setProductoEditando(null);
      setMostrarModal(false);
      cargarProductos();
    } catch (error) {
      console.error('Error al guardar cambios del producto:', error);
    }
  };

  const handleEditar = (producto) => {
    setProductoEditando(producto);
    setNombre(producto.nombre);
    setPrecio(String(producto.precio));
    setMostrarModal(true);
  };

  const handleAbrirCrear = () => {
    setProductoEditando(null);
    setNombre('');
    setPrecio('');
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setProductoEditando(null);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await api.delete(`/productos/${id}`);
        cargarProductos();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  return (
    <AppShell activePath="/productos">
      <section className="content-body">
        <div className="page-title-zone">
          <div className="title-icon">
            <span className="material-symbols-outlined size-xl">inventory</span>
          </div>
          <div>
            <h2>Gestión de Productos</h2>
            <p className="subtitle">Administra el catálogo de productos de la fábrica</p>
          </div>
        </div>

        <div className="action-bar">
          <div className="crud-buttons">
            <button type="button" className="btn btn-success" onClick={handleAbrirCrear}>
              <span className="material-symbols-outlined">add</span> Nuevo Producto
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

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.id}</td>
                    <td>{producto.nombre}</td>
                    <td>${producto.precio}</td>
                    <td>
                      <button
                        type="button"
                        className="action-btn edit-inline"
                        onClick={() => handleEditar(producto)}
                        title="Editar"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        type="button"
                        className="action-btn delete-inline"
                        onClick={() => handleEliminar(producto.id)}
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                    {productos.length === 0
                      ? 'No hay productos registrados o el backend de Java está apagado.'
                      : 'No se encontraron productos que coincidan con la búsqueda.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="table-footer">
          <span>Mostrando {productosFiltrados.length} de {productos.length} productos</span>
          <div className="pagination">
            <button type="button" className="page-nav" disabled>&lt;</button>
            <button type="button" className="page-num active">1</button>
            <button type="button" className="page-nav" disabled>&gt;</button>
          </div>
        </footer>
      </section>

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
              {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Precio ($)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-danger" onClick={handleCerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  {productoEditando ? 'Guardar Cambios' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default Productos;