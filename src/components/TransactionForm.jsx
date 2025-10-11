import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field'; // 1. Importe o novo componente

function TransactionForm({ onAddTransaction }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!description || !amount) {
      alert('Por favor, preencha a descrição e o valor.');
      return;
    }

    const newTransaction = {
      id: Date.now(),
      description: description,
      amount: type === 'expense' ? -parseFloat(amount) : parseFloat(amount),
    };

    onAddTransaction(newTransaction);

    setDescription('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <h2>Adicionar Nova Transação</h2>
      <div className="form-control">
        <label>Descrição</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Salário, Almoço..."
        />
      </div>
      <div className="form-control">
        <label>Valor (R$)</label>
        {/* 2. Substitua o <input> antigo por este componente */}
        <CurrencyInput
          id="transaction-amount"
          name="amount"
          placeholder="Ex: R$ 50,00"
          value={amount}
          // A mágica acontece aqui: onValueChange nos dá o valor numérico puro
          onValueChange={(value) => setAmount(value)}
          intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
          className="currency-input" // Adicionamos uma classe para possível estilo futuro
        />
      </div>
      <div className="form-control radio-group">
        <label>
          <input type="radio" value="income" checked={type === 'income'} onChange={(e) => setType(e.target.value)} />
          Receita
        </label>
        <label>
          <input type="radio" value="expense" checked={type === 'expense'} onChange={(e) => setType(e.target.value)} />
          Despesa
        </label>
      </div>
      <button type="submit">Adicionar Transação</button>
    </form>
  );
}

export default TransactionForm;