import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  // NOVO: Estado para controlar o menu mobile (aberto/fechado)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="app-container">
      <header>
        <h1>Meu Controle Financeiro</h1>
        
        {/* NAVEGAÇÃO PARA DESKTOP (a que já tínhamos) */}
        <nav className="main-nav desktop-nav">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/recurring">Recorrências</NavLink>
          <NavLink to="/cards">Cartões</NavLink>
          <NavLink to="/loans">Empréstimos</NavLink>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </nav>

        {/* NOVO: BOTÃO HAMBÚRGUER (só aparece no mobile) */}
        <button className="hamburger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>

        {/* NOVO: NAVEGAÇÃO MOBILE (menu lateral que abre e fecha) */}
        <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
          {/* Ao clicar em um link, o menu fecha */}
          <NavLink to="/" onClick={() => setIsMenuOpen(false)}>Dashboard</NavLink>
          <NavLink to="/recurring" onClick={() => setIsMenuOpen(false)}>Recorrências</NavLink>
          <NavLink to="/cards" onClick={() => setIsMenuOpen(false)}>Cartões</NavLink>
          <NavLink to="/loans" onClick={() => setIsMenuOpen(false)}>Empréstimos</NavLink>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;