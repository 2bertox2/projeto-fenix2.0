import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

function CardExpenseForm({ cardId, onAddExpense }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) {
      alert('Preencha a descrição e o valor.');
      return;
    }
    onAddExpense({ description, amount: parseFloat(amount), card_id: cardId });
    setDescription('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="card-expense-form">
      <h4>Novo Gasto no Cartão</h4>
      <div className="form-row">
        <div className="form-field description-field"><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição do gasto" required /></div>
        <div className="form-field">
          <CurrencyInput
            name="expense-amount"
            placeholder="Valor (R$)"
            value={amount}
            onValueChange={(value) => setAmount(value)}
            intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
            className="currency-input"
            required
            decimalScale={2} // <-- A CORREÇÃO ESTÁ AQUI
          />
        </div>
        <button type="submit">Adicionar</button>
      </div>
    </form>
  );
}

export default CardExpenseForm;