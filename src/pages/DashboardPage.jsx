import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Dashboard from '../components/Dashboard';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTransactions() {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar transações:', error.message);
      } else {
        setTransactions(data);
      }
      setLoading(false);
    }
    getTransactions();
  }, []);

  const handleAddTransaction = async (transactionData) => {
    const { description, amount } = transactionData;
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ description, amount: amount < 0 ? amount : amount }]) // Garantindo que o valor seja correto
      .select();

    if (error) {
      console.error('Erro ao adicionar transação:', error.message);
    } else {
      setTransactions((prevTransactions) => [data[0], ...prevTransactions]);
    }
  };

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome + totalExpenses;

  return (
    <>
      <Dashboard income={totalIncome} expenses={totalExpenses * -1} balance={balance} />
      <TransactionForm onAddTransaction={handleAddTransaction} />
      {loading ? (
        <p className="loading-message">Carregando transações...</p>
      ) : (
        <TransactionList transactions={transactions} />
      )}
    </>
  );
}

export default DashboardPage;