import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExpenseTracker } from './components/ExpenseTracker';
import './index.css';

function App() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Gestor de Gastos</h1>
      
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ExpenseTracker />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
