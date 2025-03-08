import React, { useState, useEffect } from 'react';
import { FoldView } from './FoldView';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';
import { Transaction } from '../types';
import { useAuth } from '../context/AuthContext';

// Simulación de API - Esto se reemplazará con llamadas reales a MongoDB
const mockTransactions: Transaction[] = [
  {
    _id: '1',
    userId: 'user1',
    type: 'income',
    description: 'Salario',
    amount: 2000,
    category: 'Salario',
    date: new Date('2023-10-01'),
  },
  {
    _id: '2',
    userId: 'user1',
    type: 'expense',
    description: 'Alquiler',
    amount: -800,
    category: 'Vivienda',
    date: new Date('2023-10-05'),
  },
  {
    _id: '3',
    userId: 'user1',
    type: 'expense',
    description: 'Supermercado',
    amount: -150,
    category: 'Alimentación',
    date: new Date('2023-10-10'),
  },
];

export const ExpenseTracker: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Simulación de carga de datos - Esto se reemplazará con llamadas reales a MongoDB
    setTransactions(mockTransactions);
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, '_id' | 'userId'>) => {
    // Simulación de API - Esto se reemplazará con llamadas reales a MongoDB
    const newTransaction: Transaction = {
      _id: Date.now().toString(),
      userId: user?._id || 'user1',
      ...transaction,
    };
    
    setTransactions([...transactions, newTransaction]);
  };

  const editTransaction = async (id: string, transaction: Omit<Transaction, '_id' | 'userId'>) => {
    // Simulación de API - Esto se reemplazará con llamadas reales a MongoDB
    setTransactions(
      transactions.map((t) =>
        t._id === id
          ? { ...t, ...transaction }
          : t
      )
    );
  };

  const deleteTransaction = async (id: string) => {
    // Simulación de API - Esto se reemplazará con llamadas reales a MongoDB
    setTransactions(transactions.filter((t) => t._id !== id));
  };

  // Determinar qué vista mostrar según el tamaño de la pantalla
  // 4 pulgadas ≈ 384px (96dpi)
  if (viewportWidth <= 384) {
    return <FoldView 
      transactions={transactions} 
      onAddTransaction={addTransaction}
    />;
  } else if (viewportWidth <= 768) {
    return (
      <MobileView
        transactions={transactions}
        onAddTransaction={addTransaction}
        onEditTransaction={editTransaction}
        onDeleteTransaction={deleteTransaction}
      />
    );
  } else {
    return (
      <DesktopView
        transactions={transactions}
        onAddTransaction={addTransaction}
        onEditTransaction={editTransaction}
        onDeleteTransaction={deleteTransaction}
      />
    );
  }
}; 