import React, { useState } from 'react';

// A NOSSA SENHA "SECRETA" - Troque '1234' pelo número que você quiser
const SENHA_CORRETA = '060307';

function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === SENHA_CORRETA) {
      // Se a senha estiver correta:
      setError('');
      localStorage.setItem('isLoggedIn', 'true');
      
      // --- LINHA CORRIGIDA ---
      // Em vez de recarregar, nós navegamos para a página inicial.
      // Isso força o carregamento do App.jsx, que vai te autenticar.
      window.location.href = '/'; 

    } else {
      // Se a senha estiver errada:
      setError('Senha incorreta.');
      setPassword('');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Acesso Restrito</h2>
        <p>Por favor, digite a senha para continuar.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          autoFocus
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default LoginPage;
