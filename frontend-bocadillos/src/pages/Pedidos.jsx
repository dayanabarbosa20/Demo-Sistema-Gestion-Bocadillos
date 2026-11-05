import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import api from '../services/api';

export default function Pedidos() {
  const [listaPedidos, setListaPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState(null);
  const [formDatos, setFormDatos] = useState({
    cliente: '',
    fecha: '',
    total: '',
    estado: 'Pendiente',
  });

  const cargarPedidos = async () => {
    try {
      const response = await api.get('/pedidos');
      setListaPedidos(Array.isArray(response.data) ? response.data : []);
      setError('');
    } catch (requestError) {
      console.error('Error al cargar pedidos:', requestError);
      setError('No se pudo cargar la lista de pedidos.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const abrirCrear = () => {
    setPedidoEditando(null);
    setFormDatos({ cliente: '', fecha: '', total: '', estado: 'Pendiente' });
    setMostrarModal(true);
  };

  const abrirEditar = (item) => {
    setPedidoEditando(item);
    setFormDatos({
      cliente: item.cliente ?? '',
      fecha: item.fecha ?? '',
      total: String(item.total ?? ''),
      estado: item.estado ?? 'Pendiente',
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setPedidoEditando(null);
  };

  const guardarPedido = async (event) => {
    event.preventDefault();
    const datosPedido = {
      cliente: formDatos.cliente,
      fecha: formDatos.fecha,
      total: Number(formDatos.total),
      estado: formDatos.estado,
    };

    try {
      if (pedidoEditando) {
        await api.put(`/pedidos/${pedidoEditando.idPedido}`, datosPedido);
      } else {
        await api.post('/pedidos', datosPedido);
      }
      cerrarModal();
      await cargarPedidos();
    } catch (requestError) {
      console.error('Error al guardar pedido:', requestError);
      window.alert('No se pudo guardar el pedido.');
    }
  };

  const eliminarPedido = async (item) => {
    if (!window.confirm(`¿Eliminar pedido del cliente ${item.cliente}?`)) return;
    try {
      await api.delete(`/pedidos/${item.idPedido}`);
      await cargarPedidos();
    } catch (requestError) {
      console.error('Error al eliminar pedido:', requestError);
      window.alert('No se pudo eliminar el pedido.');
    }
  };

  const consulta = busqueda.toLowerCase();
  const pedidosFiltrados = listaPedidos.filter((item) =>
    [item.cliente, item.estado, item.fecha, item.idPedido, item.total].some((val) =>
      String(val ?? '').toLowerCase().includes(consulta)
    )
  );

  return (
    <AppShell activePath="/pedidos">
      <section className="content-body">
        <div className="page-title-zone">
          <div className="title-icon">
            <span className="material-symbols-outlined size-xl">shopping_cart</span>
          </div>
          <div>
            <h2>Gestión de Pedidos</h2>
            <p className="subtitle">Administra las ventas y pedidos de clientes</p>
          </div>
        </div>

        <div className="action-bar">
          <button type="button" className="btn btn-success" onClick={abrirCrear}>
            <span className="material-symbols-outlined">add</span> Nuevo Pedido
          </button>
          <div className="search-box">
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              placeholder="Buscar pedido..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total ($)</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Cargando...</td></tr>
              ) : error ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>{error}</td></tr>
              ) : pedidosFiltrados.length > 0 ? (
                pedidosFiltrados.map((item) => (
                  <tr key={item.idPedido}>
                    <td>#{item.idPedido}</td>
                    <td>{item.cliente}</td>
                    <td>{item.fecha}</td>
                    <td>${item.total}</td>
                    <td><span className="badge">{item.estado}</span></td>
                    <td>
                      <button type="button" className="action-btn edit-inline" onClick={() => abrirEditar(item)}>
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button type="button" className="action-btn delete-inline" onClick={() => eliminarPedido(item)}>
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No hay pedidos registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {mostrarModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', width: '400px' }}>
            <h3>{pedidoEditando ? 'Editar Pedido' : 'Nuevo Pedido'}</h3>
            <form onSubmit={guardarPedido}>
              <div style={{ marginBottom: '10px' }}>
                <label>Cliente</label>
                <input type="text" value={formDatos.cliente} onChange={(e) => setFormDatos({ ...formDatos, cliente: e.target.value })} style={{ width: '100%', padding: '8px' }} required />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Fecha</label>
                <input type="date" value={formDatos.fecha} onChange={(e) => setFormDatos({ ...formDatos, fecha: e.target.value })} style={{ width: '100%', padding: '8px' }} required />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Total ($)</label>
                <input type="number" step="0.01" value={formDatos.total} onChange={(e) => setFormDatos({ ...formDatos, total: e.target.value })} style={{ width: '100%', padding: '8px' }} required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Estado</label>
                <select value={formDatos.estado} onChange={(e) => setFormDatos({ ...formDatos, estado: e.target.value })} style={{ width: '100%', padding: '8px' }}>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Enviado">Enviado</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-danger" onClick={cerrarModal}>Cancelar</button>
                <button type="submit" className="btn btn-success">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}