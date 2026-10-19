import React from 'react';
import { Link } from 'react-router-dom';

const menuItems = [
  { to: '/dashboard', icon: 'home', label: 'Inicio' },
  { to: '/inventario', icon: 'inventory_2', label: 'Inventario' },
  { to: '/productos', icon: 'inventory', label: 'Productos' },
  { to: '/produccion', icon: 'precision_manufacturing', label: 'Producción' },
  { to: '/pedidos', icon: 'orders', label: 'Pedidos' },
  { to: '/proveedores', icon: 'local_shipping', label: 'Proveedores' },
  { to: '/reportes', icon: 'bar_chart', label: 'Reportes' },
];

export default function AppShell({ children, activePath }) {
  return (
    <div className="app-container">
      {/* BARRA LATERAL */}
      <aside className="sidebar">
        <div className="brand-logo">
          {/* Apunta directamente a la carpeta public/img/logo3.jfif */}
          <img src="/img/logo3.jfif" alt="Logo Bocadillo Veleño" className="logo-img" />
        </div>

        <nav className="menu">
          {menuItems.map(({ to, icon, label }) => (
            <Link 
              key={to} 
              to={to} 
              className={`menu-item${activePath === to ? ' active' : ''}`}
            >
              <span className="material-symbols-outlined">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="menu-item logout">
            <span className="material-symbols-outlined">logout</span>
            Cerrar sesión
          </Link>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <span className="material-symbols-outlined menu-toggle">menu</span>
            <h1>SISTEMA DE GESTIÓN INTEGRAL</h1>
          </div>
          <div className="header-right">
            <span className="date">
              <span className="material-symbols-outlined">calendar_month</span>
              02 de junio 2026
            </span>
            <span className="user-role">
              <span className="material-symbols-outlined">account_circle</span>
              Administrador
            </span>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}