import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reportes from './pages/Reportes';
import Inventario from './pages/Inventario';
import Productos from './pages/Productos';
import Produccion from './pages/Produccion';
import Pedidos from './pages/Pedidos';
import Proveedores from './pages/Proveedores';
import CerrarSesion from './pages/CerrarSesion';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/produccion" element={<Produccion />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/cerrar-sesion" element={<CerrarSesion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;