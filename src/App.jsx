import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function App() {
  // O estado de autenticação começa como 'false'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Ao carregar o App, verifica se o usuário já "lembrou" o login no localStorage
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    } else {
      // Se não estiver logado, garante que ele seja enviado para a página de login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Se o usuário ainda não foi autenticado (verificação inicial), não mostramos nada
  // O Outlet renderizará a página de Login que é a única rota acessível
  if (!isAuthenticated) {
    return <Outlet />;
  }

  // Se estiver autenticado, mostra o layout principal do app
  return (
    <div className="app-container">
      <header>
        <h1>Meu Controle Financeiro</h1>
        <nav className="main-nav">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/recurring">Recorrências</NavLink>
          {/* ESTA É A LINHA QUE ESTAVA FALTANDO */}
          <NavLink to="/cards">Cartões</NavLink>
          <NavLink to="/loans">Empréstimos</NavLink> {/* <-- ADICIONE ESTA LINHA */}
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </nav>
      </header>
      <main>
        {/* O Outlet é onde o React Router vai renderizar a página da rota atual */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;