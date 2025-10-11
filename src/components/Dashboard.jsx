import React from 'react';

// Este componente é bem "burro", ele só recebe os totais e exibe.
// Toda a lógica de cálculo ficará no App.jsx
function Dashboard({ income, expenses, balance }) {
  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card income">
        <h3>Receitas</h3>
        <p>{formatCurrency(income)}</p>
      </div>
      <div className="dashboard-card expenses">
        <h3>Despesas</h3>
        <p>{formatCurrency(expenses)}</p>
      </div>
      <div className="dashboard-card balance">
        <h3>Saldo Atual</h3>
        <p>{formatCurrency(balance)}</p>
      </div>
    </div>
  );
}

export default Dashboard;