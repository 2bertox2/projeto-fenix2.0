import React from 'react';

function RecurringList({ items, onDelete }) {
  if (items.length === 0) {
    return <p className="transactions-list-empty">Nenhuma recorrência cadastrada.</p>;
  }
  return (
    <div className="transactions-list">
      <h3>Recorrências Salvas</h3>
      <ul>
        {items.map(item => (
          <li key={item.id} className={item.amount < 0 ? 'expense' : 'income'}>
            <span className="recurring-day">Dia {item.day_of_month}</span>
            <span className="recurring-desc">{item.description}</span>
            <span className="recurring-amount">{item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            <button onClick={() => onDelete(item.id)} className="delete-btn">×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecurringList;