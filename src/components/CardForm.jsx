import React, { useState } from 'react';

function CardForm({ onAddCard }) {
  const [name, setName] = useState('');
  const [closingDay, setClosingDay] = useState('');
  const [dueDay, setDueDay] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !closingDay || !dueDay) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    onAddCard({
      name,
      closing_day: parseInt(closingDay),
      due_day: parseInt(dueDay),
    });
    // Limpa o formulário
    setName('');
    setClosingDay('');
    setDueDay('');
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form recurring-form">
      <h3>Adicionar Novo Cartão</h3>
      <div className="form-row">
        <div className="form-field description-field">
          <label htmlFor="card-name">Nome do Cartão</label>
          <input
            id="card-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Nubank, Santander SX"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="card-closing">Dia do Fechamento</label>
          <input
            id="card-closing"
            type="number"
            value={closingDay}
            onChange={(e) => setClosingDay(e.target.value)}
            placeholder="Ex: 20"
            min="1" max="31" required
          />
        </div>
        <div className="form-field">
          <label htmlFor="card-due">Dia do Vencimento</label>
          <input
            id="card-due"
            type="number"
            value={dueDay}
            onChange={(e) => setDueDay(e.target.value)}
            placeholder="Ex: 28"
            min="1" max="31" required
          />
        </div>
      </div>
      <button type="submit">Salvar Cartão</button>
    </form>
  );
}

export default CardForm;