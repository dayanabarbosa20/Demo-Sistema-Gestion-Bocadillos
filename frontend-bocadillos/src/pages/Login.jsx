import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('login-page-body');

    return () => document.body.classList.remove('login-page-body');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Intentamos conectar con el Backend de Spring Boot
      const response = await fetch('http://localhost:8080/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        console.log("Conectado al Backend exitosamente");
      }
    } catch (error) {
      console.warn("Backend no disponible en el puerto 8080. Entrando en modo seguro...");
    } finally {
      // SIEMPRE redirige al Dashboard sin bloquear la pantalla
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-container">
      <div className="login-avatar-zone">
        <span className="material-symbols-outlined login-avatar-icon">account_circle</span>
      </div>

      <div className="login-header">
        <h2>Sistema de Gestión integral</h2>
        <p>Fabrica de Bocadillos Mundo Raro</p>
      </div>

      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">
            <span className="material-symbols-outlined label-icon">person</span>
            Usuario
          </label>
          <div className="input-wrapper">
            <input
              type="email"
              id="username"
              placeholder="username@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">
            <span className="material-symbols-outlined label-icon">lock</span>
            Contraseña
          </label>
          <div className="input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="visibility-icon"
              role="button"
              tabIndex="0"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              onClick={() => setShowPassword((visible) => !visible)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowPassword((visible) => !visible);
                }
              }}
            >
              <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </span>
          </div>
        </div>

        <button type="submit" className="btn-login-submit">
          <span className="material-symbols-outlined">arrow_forward</span>
          INGRESAR
        </button>

        <div className="login-forgot-zone">
          <a href="#" className="forgot-link">¿Olvido su Contraseña?</a>
        </div>
      </form>
    </div>
  );
}