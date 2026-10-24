import React, { useState } from "react";
import AppShell from "../components/AppShell";

export default function Reportes() {
  const [tipo, setTipo] = useState("Inventario");

  const datos = {
    Inventario: [
      { c1: "001", c2: "Bocadillo Veleño", c3: "100 unidades", c4: "Disponible", c5: "2026-10-22" },
      { c1: "002", c2: "Guayaba", c3: "50 kg", c4: "Disponible", c5: "2026-10-21" },
      { c1: "003", c2: "Azúcar", c3: "12 kg", c4: "Bajo Stock", c5: "2026-10-22" },
    ],
    Produccion: [
      { c1: "LOT-018", c2: "Bocadillo de guayaba", c3: "480 unidades", c4: "2026-10-22", c5: "En producción" },
      { c1: "LOT-017", c2: "Bocadillo veleño", c3: "320 unidades", c4: "2026-10-22", c5: "Completado" },
      { c1: "LOT-016", c2: "Bocadillo con arequipe", c3: "240 unidades", c4: "2026-10-21", c5: "Completado" },
    ],
    Pedidos: [
      { c1: "PED001", c2: "Tienda Dulce Sabor", c3: "2026-10-05", c4: "30 cajas", c5: "$150.000", c6: "Pendiente" },
      { c1: "PED002", c2: "Supermercado La Canasta", c3: "2026-10-07", c4: "80 cajas", c5: "$320.000", c6: "En proceso" },
      { c1: "PED003", c2: "Panadería San José", c3: "2026-10-07", c4: "50 cajas", c5: "$120.000", c6: "Cancelado" },
    ],
    Proveedores: [
      { c1: "Lácteos El Valle", c2: "3171234567", c3: "contacto@lacteoselvalle.com", c4: "Leche y Arequipe", c5: "Activo" },
      { c1: "Empaques Del Norte", c2: "3182345678", c3: "ventas@empaquesnorte.com", c4: "Hojas y Cajas", c5: "Activo" },
      { c1: "Azúcares Colombianos", c2: "3154566789", c3: "info@azucarescol.com", c4: "Azúcar Invertida", c5: "Activo" },
    ]
  };

  const headers = {
    Inventario: ["Código", "Producto", "Existencias", "Estado", "Última Mod."],
    Produccion: ["Código Lote", "Producto Fabricado", "Cantidad", "Fecha", "Estado"],
    Pedidos: ["ID Pedido", "Cliente", "Fecha", "Cantidad", "Total", "Estado"],
    Proveedores: ["Proveedor", "Teléfono", "Correo", "Suministro", "Estado"]
  };

  return (
    <AppShell title="Reportes">
      <style>{`
        @page {
          size: landscape;
          margin: 15mm;
        }
        @media print {
          body * {
            visibility: hidden !important;
          }
          .hoja-reporte, .hoja-reporte * {
            visibility: visible !important;
          }
          .hoja-reporte {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #fff !important;
          }
        }
      `}</style>

      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Encabezado */}
        <div className="no-imprimir" style={{ marginBottom: "20px" }}>
          <h1 style={{ fontSize: "24px", color: "#1F2937", margin: 0 }}>📊 Reportes</h1>
          <p style={{ color: "#6B7280", fontSize: "14px", margin: "4px 0 0 0" }}>Genera y consulta reportes de la fábrica</p>
        </div>

        {/* 4 Tarjetas de Selección Individuales */}
        <div className="no-imprimir" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {[
            { id: "Inventario", icon: "📦", title: "Reporte de Inventario" },
            { id: "Produccion", icon: "⚙️", title: "Reporte de Producción" },
            { id: "Pedidos", icon: "🛒", title: "Reporte de Pedidos" },
            { id: "Proveedores", icon: "🚚", title: "Reporte de Proveedores" }
          ].map((item) => (
            <div key={item.id} style={{
              backgroundColor: "#FFF", borderRadius: "12px", padding: "20px", textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: tipo === item.id ? "2px solid #0F5132" : "1px solid #E5E7EB"
            }}>
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>{item.icon}</div>
              <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#1F2937", margin: "0 0 12px 0" }}>{item.title}</h3>
              <button onClick={() => setTipo(item.id)} style={{
                width: "100%", backgroundColor: "#0F5132", color: "#FFF", border: "none",
                padding: "8px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "13px"
              }}>
                {tipo === item.id ? "Seleccionado ✓" : "Generar Reporte"}
              </button>
            </div>
          ))}
        </div>

        {/* HOJA DE REPORTE INDIVIDUAL (Aislamiento absoluto para impresión limpia) */}
        <div className="hoja-reporte" style={{ backgroundColor: "#FFF", padding: "32px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #E5E7EB" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #0F5132", paddingBottom: "14px", marginBottom: "20px" }}>
            <div>
              <h2 style={{ color: "#0F5132", margin: 0, fontSize: "20px" }}>FÁBRICA DE BOCADILLOS VELEÑOS</h2>
              <p style={{ color: "#4B5563", margin: "4px 0 0 0", fontSize: "14px", fontWeight: "bold" }}>INFORME DE {tipo.toUpperCase()}</p>
            </div>
            <div style={{ textAlign: "right", fontSize: "12px", color: "#6B7280" }}>
              <p style={{ margin: 0 }}><strong>Emisión:</strong> {new Date().toLocaleDateString('es-CO')}</p>
              <p style={{ margin: "2px 0 0 0" }}><strong>Sistema:</strong> Gestión Integral</p>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#8FBC6B", color: "#FFF" }}>
                {headers[tipo].map((h, i) => <th key={i} style={{ padding: "12px 16px" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {datos[tipo].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #E5E7EB" }}>
                  <td style={{ padding: "12px 16px", fontWeight: "500" }}>{row.c1}</td>
                  <td style={{ padding: "12px 16px" }}>{row.c2}</td>
                  <td style={{ padding: "12px 16px" }}>{row.c3}</td>
                  <td style={{ padding: "12px 16px" }}>{row.c4}</td>
                  {row.c5 && <td style={{ padding: "12px 16px" }}>{row.c5}</td>}
                  {row.c6 && <td style={{ padding: "12px 16px" }}>{row.c6}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Barra Inferior con Botones */}
        <div className="no-imprimir" style={{ backgroundColor: "#FFF", borderRadius: "12px", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginTop: "24px" }}>
          <p style={{ margin: 0, fontSize: "13px", color: "#6B7280" }}>Mostrando reporte de <strong>{tipo}</strong> listo para exportar individualmente.</p>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => window.print()} style={{ backgroundColor: "#0F5132", color: "#FFF", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}>📄 Exportar {tipo} a PDF</button>
            <button onClick={() => alert(`Exportando ${tipo} a Excel...`)} style={{ backgroundColor: "#F3F4F6", color: "#374151", border: "1px solid #D1D5DB", padding: "10px 20px", borderRadius: "6px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}>📊 Exportar Excel</button>
          </div>
        </div>

      </div>
    </AppShell>
  );
}