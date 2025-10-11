import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import LoanForm from '../components/LoanForm';
import LoansList from '../components/LoansList';

function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getLoans() {
      setLoading(true);
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('status', 'active') // Busca apenas empréstimos ativos
        .order('created_at', { ascending: false });
      
      if (error) console.error('Erro ao buscar empréstimos:', error.message);
      else setLoans(data);
      setLoading(false);
    }
    getLoans();
  }, []);

  const handleAddLoan = async (loanData) => {
    const { data, error } = await supabase.from('loans').insert([loanData]).select();
    if (error) {
      alert('Erro ao salvar empréstimo: ' + error.message);
    } else {
      setLoans(prev => [data[0], ...prev]);
    }
  };

  const handleRegisterPayment = async (loan) => {
    // Pede ao usuário o valor do pagamento
    const paymentAmount = loan.installment_amount || 0;
    const paidValueString = prompt(`Registrar pagamento para "${loan.description}".\nValor da parcela: R$ ${paymentAmount}\nDigite o valor pago:`, paymentAmount);
    
    if (paidValueString === null) return; // Usuário cancelou
    
    const paidValue = parseFloat(paidValueString.replace(',', '.'));
    if (isNaN(paidValue) || paidValue <= 0) {
      alert('Valor inválido.');
      return;
    }
    
    const newAmountPaid = loan.amount_paid + paidValue;
    const isPaidOff = newAmountPaid >= loan.total_amount;

    // Atualiza o empréstimo no banco de dados
    const { data: updatedLoan, error } = await supabase
      .from('loans')
      .update({
        amount_paid: newAmountPaid,
        status: isPaidOff ? 'paid_off' : 'active',
      })
      .eq('id', loan.id)
      .select();

    if (error) {
      alert('Erro ao registrar pagamento: ' + error.message);
    } else {
      // Cria a transação correspondente no dashboard
      await supabase.from('transactions').insert([{
        description: `Pagamento Empréstimo: ${loan.description}`,
        // Se for um empréstimo que PEGUEI, é uma despesa. Se EMPRESTEI, é uma receita.
        amount: loan.type === 'taken' ? -paidValue : paidValue,
      }]);
      
      // Atualiza a lista na tela
      setLoans(prevLoans => prevLoans.map(l => l.id === loan.id ? updatedLoan[0] : l).filter(l => l.status === 'active'));

      if (isPaidOff) {
        alert(`Empréstimo "${loan.description}" foi quitado!`);
      }
    }
  };

  const loansTaken = loans.filter(l => l.type === 'taken');
  const loansGiven = loans.filter(l => l.type === 'given');

  return (
    <div>
      <h2>Controle de Empréstimos</h2>
      <p className="page-description">Gerencie suas dívidas e os valores que você tem a receber.</p>
      <LoanForm onAddLoan={handleAddLoan} />
      {loading ? (
        <p className="loading-message">Carregando empréstimos...</p>
      ) : (
        <div className="loans-container">
          <LoansList title="Dívidas a Pagar" loans={loansTaken} onRegisterPayment={handleRegisterPayment} />
          <LoansList title="Valores a Receber" loans={loansGiven} onRegisterPayment={handleRegisterPayment} />
        </div>
      )}
    </div>
  );
}

export default LoansPage;