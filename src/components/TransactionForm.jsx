import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

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
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Salário, Almoço..." />
      </div>
      <div className="form-control">
        <label>Valor (R$)</label>
        <CurrencyInput
          id="transaction-amount"
          name="amount"
          placeholder="Ex: R$ 50,00"
          value={amount}
          onValueChange={(value) => setAmount(value)}
          intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
          className="currency-input"
          decimalScale={2} // <-- A CORREÇÃO ESTÁ AQUI
        />
      </div>
      <div className="form-control radio-group">
        <label><input type="radio" value="income" checked={type === 'income'} onChange={(e) => setType(e.target.value)} /> Receita</label>
        <label><input type="radio" value="expense" checked={type === 'expense'} onChange={(e) => setType(e.target.value)} /> Despesa</label>
      </div>
      <button type="submit">Adicionar Transação</button>
    </form>
  );
}

export default TransactionForm;