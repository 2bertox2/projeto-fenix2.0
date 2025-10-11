import React from 'react';

function LoansList({ title, loans, onRegisterPayment }) {
  const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="loans-list-section">
      <h3>{title}</h3>
      {loans.length === 0 ? (
        <p className="transactions-list-empty">Nenhum empréstimo nesta categoria.</p>
      ) : (
        <ul className="loans-list">
          {loans.map(loan => {
            const progress = (loan.amount_paid / loan.total_amount) * 100;
            return (
              <li key={loan.id} className="loan-item">
                <div className="loan-info">
                  <span className="loan-description">{loan.description}</span>
                  <div className="loan-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="progress-text">
                      {formatCurrency(loan.amount_paid)} / {formatCurrency(loan.total_amount)}
                    </span>
                  </div>
                </div>
                <div className="loan-details">
                  {loan.installment_amount && (
                    <span>Parcela: {formatCurrency(loan.installment_amount)}</span>
                  )}
                  {loan.installment_due_day && (
                    <span>Vencimento: Dia {loan.installment_due_day}</span>
                  )}
                </div>
                <div className="loan-actions">
                  <button onClick={() => onRegisterPayment(loan)} className="pay-btn">
                    Registrar Pagamento
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default LoansList;