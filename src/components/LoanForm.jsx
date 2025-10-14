import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

function LoanForm({ onAddLoan }) {
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [type, setType] = useState('taken');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [installmentDueDay, setInstallmentDueDay] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !totalAmount) {
      alert('A descrição e o valor total são obrigatórios.');
      return;
    }
    onAddLoan({ description, total_amount: parseFloat(totalAmount), type, installment_amount: installmentAmount ? parseFloat(installmentAmount) : null, installment_due_day: installmentDueDay ? parseInt(installmentDueDay) : null });
    setDescription('');
    setTotalAmount('');
    setInstallmentAmount('');
    setInstallmentDueDay('');
    setType('taken');
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form recurring-form">
      <h3>Adicionar Novo Empréstimo</h3>
      <div className="form-row">
        <div className="form-field" style={{ flex: 2 }}><label>Descrição</label><input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Empréstimo Carro" required /></div>
        <div className="form-field">
          <label>Valor Total (R$)</label>
          <CurrencyInput
            value={totalAmount}
            onValueChange={(value) => setTotalAmount(value)}
            intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
            className="currency-input"
            required
            decimalScale={2} // <-- A CORREÇÃO ESTÁ AQUI
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label>Valor da Parcela (R$)</label>
          <CurrencyInput
            value={installmentAmount}
            onValueChange={(value) => setInstallmentAmount(value)}
            intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
            className="currency-input"
            placeholder="Opcional"
            decimalScale={2} // <-- A CORREÇÃO ESTÁ AQUI TAMBÉM
          />
        </div>
        <div className="form-field"><label>Dia do Vencimento</label><input type="number" value={installmentDueDay} onChange={e => setInstallmentDueDay(e.target.value)} placeholder="Opcional" min="1" max="31" /></div>
        <div className="form-field radio-group-container"><label>Tipo</label><div className="radio-group"><label><input type="radio" value="taken" checked={type === 'taken'} onChange={e => setType(e.target.value)} /> Peguei</label><label><input type="radio" value="given" checked={type === 'given'} onChange={e => setType(e.target.value)} /> Emprestei</label></div></div>
      </div>
      <button type="submit">Salvar Empréstimo</button>
    </form>
  );
}

export default LoanForm;