import { Link } from 'react-router-dom';
import './Dashboard.css';

const metrics = [
  {
    title: 'Inventario',
    value: '180',
    description: 'Unidades en Stock',
    path: '/inventario',
    icon: 'inventory_2',
    tone: 'green',
  },
  {
    title: 'Pedidos',
    value: '3',
    description: 'Pendientes de Despacho',
    path: '/pedidos',
    icon: 'orders',
    tone: 'red',
  },
  {
    title: 'Producción',
    value: '3',
    description: 'Lotes Activos',
    path: '/produccion',
    icon: 'precision_manufacturing',
    tone: 'green',
  },
  {
    title: 'Proveedores',
    value: '10',
    description: 'Registrados',
    path: '/proveedores',
    icon: 'local_shipping',
    tone: 'green',
  },
];

const recentBatches = [
  { code: 'LOT-2606-018', product: 'Bocadillo de guayaba', quantity: '480 unidades', status: 'En producción' },
  { code: 'LOT-2606-017', product: 'Bocadillo veleño', quantity: '320 unidades', status: 'Completado' },
  { code: 'LOT-2606-016', product: 'Bocadillo con arequipe', quantity: '240 unidades', status: 'Completado' },
];

const stockAlerts = [
  { name: 'Azúcar', amount: '30 kg', minimum: '50 kg', icon: 'cookie' },
];

export default function Dashboard() {
  const today = new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="app-container">
      
      {/* MENÚ LATERAL */}
      <aside className="sidebar">
        <div className="brand-logo">
          <img
            src="/img/logo3.jfif"
            alt="Logo Bocadillos Factory"
            className="logo-img"
          />
        </div>
        
        <nav className="menu">
          <Link to="/dashboard" className="menu-item active">
            <span className="material-symbols-outlined">home</span>Inicio
          </Link>
          <Link to="/inventario" className="menu-item">
            <span className="material-symbols-outlined">inventory_2</span> Inventario
          </Link>
          <Link to="/productos" className="menu-item">
            <span className="material-symbols-outlined">inventory_2</span> Productos
          </Link>
          <Link to="/produccion" className="menu-item">
            <span className="material-symbols-outlined">precision_manufacturing</span> Producción
          </Link>
          <Link to="/pedidos" className="menu-item">
            <span className="material-symbols-outlined">orders</span> Pedidos
          </Link>
          <Link to="/proveedores" className="menu-item">
            <span className="material-symbols-outlined">local_shipping</span> Proveedores
          </Link>
          <Link to="/reportes" className="menu-item">
            <span className="material-symbols-outlined">bar_chart</span> Reportes
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="menu-item logout">
            <span className="material-symbols-outlined">logout</span> Cerrar sesión
          </Link>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        
        {/* ENCABEZADO SUPERIOR */}
        <header className="top-header">
          <div className="header-left">
            <span className="material-symbols-outlined menu-toggle">menu</span>
            <h1>SISTEMA DE GESTIÓN INTEGRAL</h1>
          </div>
          <div className="header-right">
            <span className="user-role">
              <span className="material-symbols-outlined">account_circle</span> Administrador
            </span>
          </div>
        </header>

        {/* SECCIÓN VARIABLE: DASHBOARD INICIO */}
        <section className="content-body dashboard-content">
          
          {/* BARRA DE BIENVENIDA Y FECHA */}
          <div className="dashboard-welcome-bar">
            <h2 className="welcome-text">Bienvenido Administrador</h2>
              <span className="dashboard-date">
              <span className="material-symbols-outlined">calendar_month</span> {today}
            </span>
          </div>

          <div className="dashboard-grid">
            {metrics.map((metric) => (
              <Link
                key={metric.title}
                to={metric.path}
                className="dashboard-kpi"
                aria-label={`${metric.title}: ${metric.value} ${metric.description}`}
              >
                <span className={`material-symbols-outlined dashboard-kpi-icon ${metric.tone}`} aria-hidden="true">
                  {metric.icon}
                </span>
                <span className="dashboard-kpi-info">
                  <span className="dashboard-kpi-title">{metric.title}</span>
                  <span className="dashboard-kpi-value">{metric.value}</span>
                  <span className="dashboard-kpi-description">{metric.description}</span>
                </span>
                <span className="material-symbols-outlined dashboard-kpi-arrow" aria-hidden="true">arrow_forward</span>
              </Link>
            ))}
          </div>

          <div className="dashboard-activity-grid">
            <section className="dashboard-panel" aria-labelledby="batches-title">
              <div className="dashboard-panel-heading">
                <div>
                  <span className="dashboard-panel-eyebrow">OPERACIÓN</span>
                  <h2 id="batches-title">Últimos lotes de producción</h2>
                </div>
                <Link to="/produccion" className="dashboard-panel-link">
                  Ver producción <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
                </Link>
              </div>
              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th scope="col">Código de lote</th>
                      <th scope="col">Producto</th>
                      <th scope="col">Cantidad</th>
                      <th scope="col">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBatches.map((batch) => (
                      <tr key={batch.code}>
                        <td className="dashboard-batch-code">{batch.code}</td>
                        <td>{batch.product}</td>
                        <td>{batch.quantity}</td>
                        <td>
                          <span className={`dashboard-status ${batch.status === 'Completado' ? 'complete' : 'running'}`}>
                            <span aria-hidden="true" />{batch.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="dashboard-panel dashboard-alerts" aria-labelledby="alerts-title">
              <div className="dashboard-panel-heading">
                <div>
                  <span className="dashboard-panel-eyebrow">ABASTECIMIENTO</span>
                  <h2 id="alerts-title">Alertas de stock bajo</h2>
                </div>
                <span className="dashboard-alert-count">
                  {stockAlerts.length} {stockAlerts.length === 1 ? 'alerta' : 'alertas'}
                </span>
              </div>
              <ul className="dashboard-alert-list">
                {stockAlerts.map((item) => (
                  <li className="dashboard-alert-item" key={item.name}>
                    <span className="material-symbols-outlined dashboard-alert-icon" aria-hidden="true">{item.icon}</span>
                    <span className="dashboard-alert-info">
                      <span className="dashboard-alert-name">{item.name}</span>
                      <span className="dashboard-alert-minimum">Mínimo: {item.minimum}</span>
                    </span>
                    <span className="dashboard-alert-amount">{item.amount}</span>
                  </li>
                ))}
              </ul>
              <Link to="/inventario" className="dashboard-stock-link">
                Revisar inventario <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
              </Link>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}