import { Link } from 'react-router-dom';

export default function Dashboard() {
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
        <section className="content-body">
          
          {/* BARRA DE BIENVENIDA Y FECHA */}
          <div className="dashboard-welcome-bar">
            <h2 className="welcome-text">Bienvenido Administrador</h2>
            <span className="dashboard-date">
              <span className="material-symbols-outlined">calendar_month</span> 02 de junio 2026
            </span>
          </div>

          {/* REJILLA DE TARJETAS DE INDICADORES (2x2) */}
          <div className="dashboard-grid">
            
            {/* Tarjeta Inventario */}
            <div className="dash-card">
              <span className="material-symbols-outlined card-icon text-green">inventory_2</span>
              <div className="card-info">
                <span className="card-title text-green">INVENTARIO</span>
                <span className="card-value">150</span>
                <span className="card-label">Productos</span>
              </div>
            </div>

            {/* Tarjeta Pedidos */}
            <div className="dash-card">
              <span className="material-symbols-outlined card-icon text-red">orders</span>
              <div className="card-info">
                <span className="card-title text-red">PEDIDOS</span>
                <span className="card-value">25</span>
                <span className="card-label">Pendientes</span>
              </div>
            </div>

            {/* Tarjeta Producción */}
            <div className="dash-card">
              <span className="material-symbols-outlined card-icon text-purple">settings</span>
              <div className="card-info">
                <span className="card-title text-purple">PRODUCCIÓN</span>
                <span className="card-value">50</span>
                <span className="card-label">Lotes activos</span>
              </div>
            </div>

            {/* Tarjeta Proveedores */}
            <div className="dash-card">
              <span className="material-symbols-outlined card-icon text-blue">local_shipping</span>
              <div className="card-info">
                <span className="card-title text-blue">PROVEEDORES</span>
                <span className="card-value">10</span>
                <span className="card-label">Registrados</span>
              </div>
            </div>

          </div>

        </section>
      </main>
    </div>
  );
}