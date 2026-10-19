import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell';

export default function CerrarSesion() {
  return (
    <AppShell activePath="/cerrar-sesion">
      <section className="content-body logout-layout">
        <div className="page-title-zone"><div className="title-icon"><span className="material-symbols-outlined size-xl">logout</span></div><div><h2>Cerrar Sesión</h2><p className="subtitle">Confirma si deseas salir del sistema</p></div></div>
        <div className="logout-card-container">
          <div className="logout-card">
            <span className="material-symbols-outlined logout-big-icon">logout</span>
            <h3>¿Esta seguro que desea cerrar sesión?</h3>
            <p>Se cerrara su sesión actual y deberas iniciar sesión nuevamente para acceder al sistema</p>
            <div className="logout-actions">
              <button type="button" className="btn-logout-cancel" onClick={() => window.history.back()}><span className="material-symbols-outlined">close</span> Cancelar</button>
              <Link to="/" className="btn-logout-confirm"><span className="material-symbols-outlined">logout</span> Cerrar sesión</Link>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
