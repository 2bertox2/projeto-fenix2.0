import React from 'react';

function TransactionList({ transactions }) {
  if (transactions.length === 0) {
    return <p className="transactions-list-empty">Nenhuma transação adicionada ainda.</p>;
  }

  return (
    <div className="transactions-list">
      <h2>Histórico</h2>
      <ul>
        {transactions.map((transaction) => (
          // Adicionamos uma classe CSS dinâmica para a cor
          <li key={transaction.id} className={transaction.amount < 0 ? 'expense' : 'income'}>
            <span>{transaction.description}</span>
            <span>{transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionList;