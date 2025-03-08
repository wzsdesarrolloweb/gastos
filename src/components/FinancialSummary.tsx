import React from 'react';
import { Transaction } from '../types';

interface FinancialSummaryProps {
  transactions: Transaction[];
  compact?: boolean;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ 
  transactions, 
  compact = false 
}) => {
  const incomeTotal = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenseTotal = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const balance = incomeTotal - expenseTotal;

  return (
    <div className={`grid ${compact ? 'grid-cols-1 gap-2' : 'grid-cols-3 gap-4'} mb-6 mx-auto max-w-4xl`}>
      <div className="bg-green-100 p-4 rounded-lg shadow text-center">
        <h3 className="text-green-800 font-semibold">Ingresos</h3>
        <p className="text-2xl font-bold text-green-600">€{incomeTotal.toFixed(2)}</p>
      </div>
      
      <div className="bg-red-100 p-4 rounded-lg shadow text-center">
        <h3 className="text-red-800 font-semibold">Gastos</h3>
        <p className="text-2xl font-bold text-red-600">€{expenseTotal.toFixed(2)}</p>
      </div>
      
      <div className={`${balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'} p-4 rounded-lg shadow text-center`}>
        <h3 className={`${balance >= 0 ? 'text-blue-800' : 'text-orange-800'} font-semibold`}>Balance</h3>
        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
          €{balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
}; 