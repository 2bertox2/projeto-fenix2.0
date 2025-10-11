import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './Routes.jsx' // Importe o novo arquivo de rotas
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes /> {/* Use o AppRoutes aqui */}
    </BrowserRouter>
  </React.StrictMode>,
)