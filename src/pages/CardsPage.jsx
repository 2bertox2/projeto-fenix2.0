import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import CardForm from '../components/CardForm';
import CardExpenseForm from '../components/CardExpenseForm';
import InvoiceHistory from '../components/InvoiceHistory';

function CardsPage() {
  const [cards, setCards] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);

  // Efeito para buscar os cartões e as faturas ao carregar a página
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      const cardsPromise = supabase.from('credit_cards').select('*').order('created_at', { ascending: false });
      const invoicesPromise = supabase.from('invoices').select('*, credit_cards(name)').order('closing_date', { ascending: false });

      const [cardsResult, invoicesResult] = await Promise.all([cardsPromise, invoicesPromise]);

      if (cardsResult.error) console.error('Erro ao buscar cartões:', cardsResult.error.message);
      else setCards(cardsResult.data);

      if (invoicesResult.error) console.error('Erro ao buscar faturas:', invoicesResult.error.message);
      else setInvoices(invoicesResult.data);

      setLoading(false);
    }
    fetchData();
  }, []);

  // Efeito para buscar os gastos da fatura aberta QUANDO um cartão é selecionado
  useEffect(() => {
    if (!selectedCardId) {
      setExpenses([]);
      return;
    }

    async function getCardExpenses() {
      setLoadingExpenses(true);
      const { data, error } = await supabase
        .from('card_expenses')
        .select('*')
        .eq('card_id', selectedCardId)
        .is('invoice_id', null) // Busca apenas gastos da fatura ABERTA
        .order('created_at', { ascending: false });

      if (error) console.error('Erro ao buscar gastos do cartão:', error.message);
      else setExpenses(data);
      setLoadingExpenses(false);
    }
    getCardExpenses();
  }, [selectedCardId]);

  // Função para adicionar um novo cartão
  const handleAddCard = async (cardData) => {
    const { data, error } = await supabase.from('credit_cards').insert([cardData]).select();
    if (error) {
      alert('Erro ao adicionar cartão: ' + error.message);
    } else {
      setCards(prev => [data[0], ...prev]);
    }
  };

  // Função para apagar um cartão
  const handleDeleteCard = async (id) => {
    if (!window.confirm('Tem certeza? Apagar um cartão também apaga todos os seus gastos e faturas.')) return;
    const { error } = await supabase.from('credit_cards').delete().eq('id', id);
    if (error) {
      alert('Erro ao apagar cartão: ' + error.message);
    } else {
      setCards(prev => prev.filter(card => card.id !== id));
    }
  };

  // Função para adicionar um novo gasto em um cartão
  const handleAddExpense = async (expenseData) => {
    const { data, error } = await supabase.from('card_expenses').insert([expenseData]).select();
    if (error) {
      alert('Erro ao adicionar gasto: ' + error.message);
    } else {
      setExpenses(prev => [data[0], ...prev]);
    }
  };

  // Função para marcar uma fatura como paga
  const handleMarkAsPaid = async (invoiceId) => {
    const { data, error } = await supabase
      .from('invoices')
      .update({ is_paid: true })
      .eq('id', invoiceId)
      .select();

    if (error) {
      alert('Erro ao marcar como paga: ' + error.message);
    } else {
      setInvoices(prevInvoices => 
        prevInvoices.map(inv => inv.id === invoiceId ? data[0] : inv)
      );
    }
  };

  // Calcula o total da fatura aberta do cartão SELECIONADO
  const totalFatura = expenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div>
      <h2>Gerenciar Cartões de Crédito</h2>
      <p className="page-description">Cadastre seus cartões e lance seus gastos diários em cada um deles.</p>
      
      <CardForm onAddCard={handleAddCard} />

      <div className="card-list-container">
        <h3>Meus Cartões</h3>
        {loading ? <p className="loading-message">Carregando cartões...</p> : (
          <div className="card-list">
            {cards.map(card => (
              <div key={card.id} className={`card-item-selectable ${selectedCardId === card.id ? 'selected' : ''}`}>
                <div className="card-item-header" onClick={() => setSelectedCardId(selectedCardId === card.id ? null : card.id)}>
                  <h4>{card.name}</h4>
                  <div className="card-header-actions">
                    <span>{selectedCardId === card.id ? '▲' : '▼'}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Impede que o card expanda/recolha ao clicar no X
                        handleDeleteCard(card.id);
                      }} 
                      className="delete-btn"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="card-item-body">
                  <p><strong>Fechamento:</strong> Dia {card.closing_day}</p>
                  <p><strong>Vencimento:</strong> Dia {card.due_day}</p>
                </div>

                {selectedCardId === card.id && (
                  <div className="card-details-view">
                    <div className="fatura-total">
                      <span>Total da Fatura Aberta:</span>
                      <strong>{totalFatura.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                    </div>
                    <CardExpenseForm cardId={selectedCardId} onAddExpense={handleAddExpense} />
                    {loadingExpenses ? <p>Carregando gastos...</p> : (
                      <ul className="expense-list">
                        {expenses.length === 0 && <li className="empty">Nenhum gasto lançado nesta fatura.</li>}
                        {expenses.map(expense => (
                          <li key={expense.id}>
                            <span>{expense.description}</span>
                            <span>{expense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <InvoiceHistory invoices={invoices} onMarkAsPaid={handleMarkAsPaid} />
    </div>
  );
}

export default CardsPage;