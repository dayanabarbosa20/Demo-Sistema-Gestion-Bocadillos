import React, { useState } from 'react';
import AppShell from '../components/AppShell';

// Datos iniciales
const datosIniciales = [
  { codigo: 'PED001', cliente: 'Tienda Dulce Sabor', fecha: '05/06/2026', cantidad: 30, total: '$150.000', estado: 'Pendiente', estadoClass: 'status-pending' },
  { codigo: 'PED002', cliente: 'Supermercado la canasta', fecha: '07/06/2026', cantidad: 80, total: '$320.000', estado: 'En proceso', estadoClass: 'status-in-progress-blue' },
  { codigo: 'PED003', cliente: 'Panaderia san jose', fecha: '07/06/2026', cantidad: 50, total: '$120.000', estado: 'Cancelado', estadoClass: 'status-cancelled' },
];

export default function Pedidos() {
  // Estados para la gestión de datos y selección
  const [listaPedidos, setListaPedidos] = useState(datosIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  // Estados para el modal del formulario
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formDatos, setFormDatos] = useState({
    codigo: '',
    cliente: '',
    fecha: '',
    total: '',
    estado: 'Pendiente'
  });

  // Mapeo automático de clases CSS según el estado
  const obtenerEstadoClass = (estado) => {
    switch (estado) {
      case 'En proceso': return 'status-in-progress-blue';
      case 'Cancelado': return 'status-cancelled';
      case 'Pendiente':
      default: return 'status-pending';
    }
  };

  // --- FILTRO DE BÚSQUEDA ---
  const pedidosFiltrados = listaPedidos.filter((item) =>
    item.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  // --- SELECCIÓN DE FILA ---
  const seleccionarFila = (pedido) => {
    if (pedidoSeleccionado?.codigo === pedido.codigo) {
      setPedidoSeleccionado(null);
    } else {
      setPedidoSeleccionado(pedido);
    }
  };

  // --- ABRIR MODAL CREAR ---
  const handleAbrirCrear = () => {
    setModoEdicion(false);
    const hoy = new Date().toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    setFormDatos({ codigo: '', cliente: '', fecha: hoy, total: '', estado: 'Pendiente' });
    setMostrarModal(true);
  };

  // --- ABRIR MODAL EDITAR ---
  const handleAbrirEditar = (pedido = pedidoSeleccionado) => {
    if (!pedido) {
      alert('Por favor selecciona un pedido para editar.');
      return;
    }
    setModoEdicion(true);
    setFormDatos({ ...pedido });
    setMostrarModal(true);
  };

  // --- ELIMINAR PEDIDO ---
  const handleEliminar = (codigoEliminar = pedidoSeleccionado?.codigo) => {
    if (!codigoEliminar) {
      alert('Por favor selecciona un pedido para eliminar.');
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar el pedido ${codigoEliminar}?`)) {
      setListaPedidos(prev => prev.filter(p => p.codigo !== codigoEliminar));
      if (pedidoSeleccionado?.codigo === codigoEliminar) {
        setPedidoSeleccionado(null);
      }
    }
  };

  // --- GUARDAR PEDIDO (CREAR / EDITAR) ---
  const handleGuardar = (e) => {
    e.preventDefault();
    if (!formDatos.codigo || !formDatos.cliente || !formDatos.total) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const estadoClass = obtenerEstadoClass(formDatos.estado);
    let totalFormateado = formDatos.total;
    if (!totalFormateado.includes('$')) {
      totalFormateado = `$${Number(totalFormateado).toLocaleString('es-CO')}`;
    }

    if (modoEdicion) {
      setListaPedidos(prev =>
        prev.map(p => p.codigo === formDatos.codigo ? {
          ...formDatos,
          total: totalFormateado,
          estadoClass
        } : p)
      );
    } else {
      if (listaPedidos.some(p => p.codigo.toLowerCase() === formDatos.codigo.toLowerCase())) {
        alert('El código del pedido ya existe. Ingresa uno diferente.');
        return;
      }
      const nuevo = {
        ...formDatos,
        total: totalFormateado,
        estadoClass
      };
      setListaPedidos(prev => [...prev, nuevo]);
    }

    setMostrarModal(false);
  };

  return (
    <AppShell activePath="/pedidos">
      <section className="content-body">
        {/* ENCABEZADO */}
        <div className="page-title-zone">
          <div className="title-icon">
            <span className="material-symbols-outlined size-xl">orders</span>
          </div>
          <div>
            <h2>Gestión de Pedidos</h2>
            <p className="subtitle">Administra los pedidos realizados por los clientes</p>
          </div>
        </div>

        {/* BARRA DE BOTONES Y BÚSQUEDA */}
        <div className="action-bar">
          <div className="crud-buttons">
            <button type="button" className="btn btn-success" onClick={handleAbrirCrear}>
              <span className="material-symbols-outlined">add</span> Nuevo Pedido
            </button>
            <button 
              type="button" 
              className={`btn btn-info ${!pedidoSeleccionado ? 'opacity-50' : ''}`}
              onClick={() => handleAbrirEditar()}
            >
              <span className="material-symbols-outlined">edit</span> Editar
            </button>
            <button 
              type="button" 
              className={`btn btn-danger ${!pedidoSeleccionado ? 'opacity-50' : ''}`}
              onClick={() => handleEliminar()}
            >
              <span className="material-symbols-outlined">delete</span> Eliminar
            </button>
          </div>

          <div className="search-box">
            <span className="material-symbols-outlined search-icon">search</span>
            <input 
              type="text" 
              placeholder="Buscar Pedido..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* TABLA DE PEDIDOS */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.length > 0 ? (
                pedidosFiltrados.map((item) => {
                  const esSeleccionado = pedidoSeleccionado?.codigo === item.codigo;
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
                      <td>{item.cliente}</td>
                      <td>{item.fecha}</td>
                      <td>{item.cantidad} cajas</td>
                      <td>{item.total}</td>
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
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                    No se encontraron pedidos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PIE DE TABLA */}
        <footer className="table-footer">
          <span>Mostrando {pedidosFiltrados.length} de {listaPedidos.length} pedidos</span>
          <div className="pagination">
            <button type="button" className="page-nav">&lt;</button>
            <button type="button" className="page-num active">1</button>
            <button type="button" className="page-nav">&gt;</button>
          </div>
        </footer>
      </section>

      {/* MODAL CREAR / EDITAR PEDIDO */}
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
              {modoEdicion ? 'Editar Pedido' : 'Nuevo Pedido'}
            </h3>
            
            <form onSubmit={handleGuardar}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Código del Pedido</label>
                <input 
                  type="text"
                  disabled={modoEdicion}
                  value={formDatos.codigo}
                  onChange={(e) => setFormDatos({...formDatos, codigo: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="Ej: PED004"
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Nombre del Cliente</label>
                <input 
                  type="text"
                  value={formDatos.cliente}
                  onChange={(e) => setFormDatos({...formDatos, cliente: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="Ej: Distribuidora Central"
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Total ($)</label>
                <input 
                  type="text"
                  value={formDatos.total}
                  onChange={(e) => setFormDatos({...formDatos, total: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="Ej: 250000"
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
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
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
                  {modoEdicion ? 'Guardar Cambios' : 'Crear Pedido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}