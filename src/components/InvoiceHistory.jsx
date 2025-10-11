import React from 'react';

function InvoiceHistory({ invoices, onMarkAsPaid }) {
  if (invoices.length === 0) {
    return (
      <div className="invoice-history">
        <h3>Histórico de Faturas</h3>
        <p className="transactions-list-empty">Nenhuma fatura fechada ainda.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <div className="invoice-history">
      <h3>Histórico de Faturas</h3>
      <ul>
        {invoices.map(invoice => (
          <li key={invoice.id} className={`invoice-item ${invoice.is_paid ? 'paid' : 'unpaid'}`}>
            <div className="invoice-info">
              <span className="invoice-card-name">Fatura {invoice.credit_cards.name}</span>
              <span className="invoice-details">
                Fechamento: {formatDate(invoice.closing_date)} | Vencimento: {formatDate(invoice.due_date)}
              </span>
            </div>
            <div className="invoice-action">
              <span className="invoice-amount">
                {invoice.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              {invoice.is_paid ? (
                <span className="paid-status">✔ Pago</span>
              ) : (
                <button onClick={() => onMarkAsPaid(invoice.id)} className="pay-btn">
                  Marcar como Paga
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InvoiceHistory;