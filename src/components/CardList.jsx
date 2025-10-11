import React from 'react';

function CardList({ cards, onDeleteCard }) {
  if (cards.length === 0) {
    return <p className="transactions-list-empty">Nenhum cartão cadastrado.</p>;
  }

  return (
    <div className="card-list-container">
      <h3>Meus Cartões</h3>
      <div className="card-list">
        {cards.map(card => (
          <div key={card.id} className="card-item">
            <div className="card-item-header">
              <h4>{card.name}</h4>
              <button onClick={() => onDeleteCard(card.id)} className="delete-btn">×</button>
            </div>
            <div className="card-item-body">
              <p><strong>Fechamento:</strong> Dia {card.closing_day}</p>
              <p><strong>Vencimento:</strong> Dia {card.due_day}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardList;