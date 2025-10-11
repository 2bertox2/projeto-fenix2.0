import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom'; // Precisamos dele de volta!
import RecurringForm from '../components/RecurringForm';
import RecurringList from '../components/RecurringList';

function RecurringPage() {
  const [recurringItems, setRecurringItems] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate(); // Inicializando para usar na navegação

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const recurringPromise = supabase.from('recurring_transactions').select('*').order('day_of_month', { ascending: true });
      const cardsPromise = supabase.from('credit_cards').select('id, name');
      const [recurringResult, cardsResult] = await Promise.all([recurringPromise, cardsPromise]);

      if (recurringResult.error) console.error('Erro ao buscar recorrências:', recurringResult.error.message);
      else setRecurringItems(recurringResult.data);

      if (cardsResult.error) console.error('Erro ao buscar cartões:', cardsResult.error.message);
      else setCards(cardsResult.data);
      
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleAddRecurring = async (item) => {
    const { description, amount, day_of_month, type, paymentMethod } = item;
    const finalAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
    const recurringData = { description, amount: finalAmount, day_of_month, payment_method: paymentMethod === 'debit' ? 'debit' : 'credit', credit_card_id: paymentMethod === 'debit' ? null : paymentMethod };
    const { data, error } = await supabase.from('recurring_transactions').insert([recurringData]).select();
    if (error) alert('Erro ao adicionar: ' + error.message);
    else setRecurringItems(prev => [...prev, data[0]].sort((a,b) => a.day_of_month - b.day_of_month));
  };

  const handleDeleteRecurring = async (id) => {
    const { error } = await supabase.from('recurring_transactions').delete().eq('id', id);
    if (error) alert('Erro ao deletar: ' + error.message);
    else setRecurringItems(prev => prev.filter(item => item.id !== id));
  };
  
  // --- A NOVA LÓGICA INTELIGENTE ---
  const handleGenerateTransactions = async () => {
    setIsGenerating(true);

    // 1. Define o período do mês atual
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString();
    
    // 2. Busca o que já existe para não duplicar
    const deTransactionsPromise = supabase.from('transactions').select('description, amount').gte('created_at', firstDay).lte('created_at', lastDay);
    const cardExpensesPromise = supabase.from('card_expenses').select('description, amount, card_id').gte('created_at', firstDay).lte('created_at', lastDay);

    const [debitResult, creditResult] = await Promise.all([deTransactionsPromise, cardExpensesPromise]);

    if (debitResult.error || creditResult.error) {
      alert("Erro ao verificar transações existentes.");
      console.error(debitResult.error || creditResult.error);
      setIsGenerating(false);
      return;
    }

    const existingDebitTransactions = debitResult.data;
    const existingCardExpenses = creditResult.data;

    const debitTransactionsToCreate = [];
    const cardExpensesToCreate = [];

    // 3. Itera sobre cada regra recorrente para decidir o que fazer
    for (const item of recurringItems) {
      if (item.payment_method === 'debit') {
        const alreadyExists = existingDebitTransactions.some(t => t.description === item.description && t.amount === item.amount);
        if (!alreadyExists) {
          debitTransactionsToCreate.push({ description: item.description, amount: item.amount });
        }
      } else if (item.payment_method === 'credit') {
        const alreadyExists = existingCardExpenses.some(t => t.description === item.description && t.card_id === item.credit_card_id);
        if (!alreadyExists) {
          // Gasto no cartão é sempre positivo, mas a regra pode ter valor negativo
          cardExpensesToCreate.push({ description: item.description, amount: Math.abs(item.amount), card_id: item.credit_card_id });
        }
      }
    }

    // 4. Insere os novos lançamentos no banco de dados (se houver algum)
    let summary = '';
    if (debitTransactionsToCreate.length > 0) {
      await supabase.from('transactions').insert(debitTransactionsToCreate);
      summary += `${debitTransactionsToCreate.length} lançamento(s) em Débito. `;
    }
    if (cardExpensesToCreate.length > 0) {
      await supabase.from('card_expenses').insert(cardExpensesToCreate);
      summary += `${cardExpensesToCreate.length} lançamento(s) em Crédito.`;
    }

    // 5. Dá o feedback final para o usuário
    if (summary === '') {
      alert('Nenhum lançamento novo para este mês. Tudo já estava em dia!');
    } else {
      alert(`Lançamentos gerados com sucesso: ${summary}`);
      navigate('/'); // Redireciona para o Dashboard!
    }

    setIsGenerating(false);
  };

  return (
    <div>
      <h2>Gerenciar Lançamentos Recorrentes</h2>
      <div className="action-box">
        <p>Clique no botão para criar os lançamentos do mês. O sistema saberá onde lançar cada um (Débito ou Crédito) e não criará duplicatas.</p>
        <button onClick={handleGenerateTransactions} disabled={isGenerating || recurringItems.length === 0} className="generate-btn">
          {isGenerating ? 'Analisando e Lançando...' : 'Lançar Transações do Mês'}
        </button>
      </div>
      <p className="page-description">Adicione ou remova suas regras de receitas e despesas que se repetem todo mês.</p>
      <RecurringForm onAddRecurring={handleAddRecurring} cards={cards} />
      {loading ? <p className="loading-message">Carregando...</p> : <RecurringList items={recurringItems} onDelete={handleDeleteRecurring} />}
    </div>
  );
}

export default RecurringPage;