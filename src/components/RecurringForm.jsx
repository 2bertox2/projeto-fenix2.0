import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

function RecurringForm({ onAddRecurring, cards }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dayOfMonth, setDayOfMonth] = useState('');
  const [type, setType] = useState('expense');
  const [paymentMethod, setPaymentMethod] = useState('debit');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !dayOfMonth) {
      alert('Todos os campos são obrigatórios.');
      return;
    }
    onAddRecurring({ description, amount: parseFloat(amount), day_of_month: parseInt(dayOfMonth), type, paymentMethod });
    // Limpa o formulário
    setDescription('');
    setAmount('');
    setDayOfMonth('');
    setPaymentMethod('debit');
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form recurring-form">
      <h3>Novo Lançamento Recorrente</h3>
      <div className="form-row">
        <div className="form-field description-field">
          <label htmlFor="recurring-description">Descrição</label>
          <input id="recurring-description" type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Aluguel" required />
        </div>
        <div className="form-field">
          <label htmlFor="recurring-amount">Valor (R$)</label>
          <CurrencyInput
            id="recurring-amount"
            name="amount"
            placeholder="Ex: R$ 1.500,00"
            value={amount}
            onValueChange={(value) => setAmount(value)}
            intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
            className="currency-input"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="recurring-day">Dia do Mês</label>
          <input id="recurring-day" type="number" value={dayOfMonth} onChange={e => setDayOfMonth(e.target.value)} placeholder="Ex: 5" min="1" max="31" required />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="payment-method">Pagar com</label>
          <select id="payment-method" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option value="debit">Débito / Conta Principal</option>
            {cards.map(card => (
              <option key={card.id} value={card.id}>
                {card.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field radio-group-container">
            <label>Tipo</label>
            <div className="radio-group">
                <label><input type="radio" value="income" checked={type === 'income'} onChange={e => setType(e.target.value)} /> Receita</label>
                <label><input type="radio" value="expense" checked={type === 'expense'} onChange={e => setType(e.target.value)} /> Despesa</label>
            </div>
        </div>
      </div>
      
      <button type="submit">Salvar Recorrência</button>
    </form>
  );
}

export default RecurringForm;