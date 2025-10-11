import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import DashboardPage from './pages/DashboardPage';
import RecurringPage from './pages/RecurringPage';
import LoginPage from './pages/LoginPage';
import CardsPage from './pages/CardsPage'; // <-- 1. IMPORTE A NOVA PÁGINA
import LoansPage from './pages/LoansPage'; // <-- 1. IMPORTE A PÁGINA

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<App />}>
        <Route index element={<DashboardPage />} />
        <Route path="recurring" element={<RecurringPage />} />
        <Route path="cards" element={<CardsPage />} /> {/* <-- 2. ADICIONE A NOVA ROTA */}
        <Route path="loans" element={<LoansPage />} /> {/* <-- 2. ADICIONE A ROTA */}
      </Route>
    </Routes>
  );
}

export default AppRoutes;