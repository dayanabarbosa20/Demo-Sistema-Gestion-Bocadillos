import React, { useState } from 'react';
import AppShell from '../components/AppShell';

// Lista de reportes disponibles
const reportes = [
  {
    id: 'inventario',
    icon: 'inventory_2',
    color: 'circle-green',
    title: 'Reporte de inventario',
    description: 'Consulta de reporte de productos y existencias actuales en inventario',
  },
  {
    id: 'produccion',
    icon: 'precision_manufacturing',
    color: 'circle-blue',
    title: 'Reporte de Producción',
    description: 'Consulta el reporte de lotes de producción realizados',
  },
  {
    id: 'pedidos',
    icon: 'orders',
    color: 'circle-yellow',
    title: 'Reporte de Pedidos',
    description: 'Consulta el reporte de pedidos realizados por los clientes',
  },
  {
    id: 'proveedores',
    icon: 'local_shipping',
    color: 'circle-purple',
    title: 'Reporte de Proveedores',
    description: 'Consulta el reporte de proveedores registrados en el sistema',
  },
];

// Datos simulados para las vistas previas de cada reporte
const datosReportes = {
  inventario: {
    columnas: ['Código', 'Producto', 'Categoría', 'Stock Actual', 'Estado'],
    filas: [
      ['INV-001', 'Bocadillo Veleño Extra 500g', 'Bocadillo Tradicional', '150 Cajas', 'Disponible'],
      ['INV-002', 'Bocadillo Combinado Guayaba/Arequipe', 'Bocadillo Especial', '85 Cajas', 'Disponible'],
      ['INV-003', 'Lonja de Guayaba 1000g', 'Formatos Grandes', '20 Cajas', 'Bajo Stock'],
    ]
  },
  produccion: {
    columnas: ['Lote', 'Producto', 'Fecha Inicio', 'Cantidad Producida', 'Estado Lote'],
    filas: [
      ['LOT-2026-01', 'Bocadillo Veleño Extra', '01/06/2026', '500 Kg', 'Completado'],
      ['LOT-2026-02', 'Bocadillo Combinado', '02/06/2026', '350 Kg', 'En Proceso'],
      ['LOT-2026-03', 'Lonja de Guayaba', '03/06/2026', '600 Kg', 'Planificado'],
    ]
  },
  pedidos: {
    columnas: ['N° Pedido', 'Cliente', 'Fecha', 'Valor Total', 'Estado Pedido'],
    filas: [
      ['PED-001', 'Tienda Dulce Sabor', '05/06/2026', '$150.000', 'Pendiente'],
      ['PED-002', 'Supermercado La Canasta', '07/06/2026', '$320.000', 'En proceso'],
      ['PED-003', 'Panadería San José', '07/06/2026', '$120.000', 'Cancelado'],
    ]
  },
  proveedores: {
    columnas: ['Proveedor', 'Teléfono', 'Correo', 'Suministro Utama', 'Estado'],
    filas: [
      ['Lácteos el Valle', '3171234567', 'contacto@lacteoselvalle.com', 'Leche y Arequipe', 'Activo'],
      ['Empaques del Norte', '3182345678', 'ventas@empaquesnorte.com', 'Hojas y Cajas', 'Activo'],
      ['Azúcares Colombianos', '3154566789', 'info@azucarescol.com', 'Azúcar Invertida', 'Activo'],
    ]
  }
};

export default function Reportes() {
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [mensajeExportacion, setMensajeExportacion] = useState('');

  // Generar reporte
  const handleGenerarReporte = (idReporte) => {
    setReporteSeleccionado(idReporte);
    setMensajeExportacion('');
  };

  // Exportar PDF
  const handleExportarPDF = () => {
    if (!reporteSeleccionado) {
      alert('Por favor selecciona un reporte para exportar.');
      return;
    }
    const repoInfo = reportes.find(r => r.id === reporteSeleccionado);
    setMensajeExportacion(`📄 Descargando "${repoInfo.title}" en formato PDF...`);
    setTimeout(() => {
      alert(`El "${repoInfo.title}" ha sido exportado exitosamente a PDF.`);
      setMensajeExportacion('');
    }, 1200);
  };

  // Exportar Excel
  const handleExportarExcel = () => {
    if (!reporteSeleccionado) {
      alert('Por favor selecciona un reporte para exportar.');
      return;
    }
    const repoInfo = reportes.find(r => r.id === reporteSeleccionado);
    setMensajeExportacion(`📊 Descargando "${repoInfo.title}" en formato Excel (.xlsx)...`);
    setTimeout(() => {
      alert(`El "${repoInfo.title}" ha sido exportado exitosamente a Excel.`);
      setMensajeExportacion('');
    }, 1200);
  };

  const infoReporteActivo = reportes.find(r => r.id === reporteSeleccionado);
  const datosActivos = reporteSeleccionado ? datosReportes[reporteSeleccionado] : null;

  return (
    <AppShell activePath="/reportes">
      <section className="content-body reportes-layout">
        {/* TÍTULO */}
        <div className="page-title-zone">
          <div className="title-icon">
            <span className="material-symbols-outlined size-xl">bar_chart</span>
          </div>
          <div>
            <h2>Reportes</h2>
            <p className="subtitle">Genera y consulta reportes de la información de la fábrica</p>
          </div>
        </div>

        {/* TARJETAS DE REPORTES */}
        <div className="reports-grid">
          {reportes.map(({ id, icon, color, title, description }) => {
            const estaActivo = reporteSeleccionado === id;
            return (
              <div 
                className={`report-card ${estaActivo ? 'selected-card' : ''}`} 
                key={title}
                style={{
                  border: estaActivo ? '2px solid #2E7D32' : '1px solid #e0e0e0',
                  boxShadow: estaActivo ? '0 4px 10px rgba(46,125,50,0.15)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div className={`card-icon-circle ${color}`}>
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <button 
                  type="button" 
                  className="btn-generate"
                  onClick={() => handleGenerarReporte(id)}
                  style={{
                    backgroundColor: estaActivo ? '#1B4332' : '',
                    color: estaActivo ? '#ffffff' : ''
                  }}
                >
                  {estaActivo ? 'Reporte Generado ✓' : 'Generar Reporte'}
                </button>
              </div>
            );
          })}
        </div>

        {/* MUESTRA VISTA PREVIA DEL REPORTE SI FUE GENERADO */}
        {reporteSeleccionado && datosActivos && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ color: '#1B4332', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined">{infoReporteActivo.icon}</span>
                Vista Previa: {infoReporteActivo.title}
              </h3>
              <span style={{ fontSize: '13px', color: '#666', backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>
                Generado el {new Date().toLocaleDateString('es-CO')}
              </span>
            </div>

            <div className="table-container" style={{ maxHeight: '250px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    {datosActivos.columnas.map((col, idx) => (
                      <th key={idx}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {datosActivos.filas.map((fila, idx) => (
                    <tr key={idx}>
                      {fila.map((celda, cIdx) => (
                        <td key={cIdx}>{celda}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MENSAJE DE ESTADO DE EXPORTACIÓN */}
        {mensajeExportacion && (
          <div style={{
            marginTop: '15px',
            padding: '12px',
            backgroundColor: '#E8F5E9',
            color: '#2E7D32',
            borderRadius: '6px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {mensajeExportacion}
          </div>
        )}

        {/* BARRA DE INFORMACIÓN Y EXPORTACIÓN */}
        <div className="info-export-bar" style={{ marginTop: '20px' }}>
          <div className="info-side">
            <span className="material-symbols-outlined info-icon">info</span>
            <div>
              <h4>Información</h4>
              <p>
                {reporteSeleccionado 
                  ? `Has seleccionado "${infoReporteActivo.title}". Puedes exportar este informe a continuación.`
                  : 'Selecciona un tipo de reporte para generar y visualizar la información correspondiente. Los reportes se pueden descargar en PDF o Excel.'}
              </p>
            </div>
          </div>
          <div className="export-buttons">
            <button 
              type="button" 
              className="btn-export btn-pdf"
              onClick={handleExportarPDF}
              style={{ opacity: !reporteSeleccionado ? 0.6 : 1, cursor: !reporteSeleccionado ? 'not-allowed' : 'pointer' }}
            >
              <span className="material-symbols-outlined">picture_as_pdf</span>
              Exportar PDF
            </button>
            <button 
              type="button" 
              className="btn-export btn-excel"
              onClick={handleExportarExcel}
              style={{ opacity: !reporteSeleccionado ? 0.6 : 1, cursor: !reporteSeleccionado ? 'not-allowed' : 'pointer' }}
            >
              <span className="material-symbols-outlined">description</span>
              Exportar Excel
            </button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}