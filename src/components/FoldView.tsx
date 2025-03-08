import React from 'react';
import { PieChart } from './PieChart';
import { Transaction } from '../types';
import { VoiceInput } from './VoiceInput';

interface FoldViewProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, '_id' | 'userId'>) => Promise<void>;
}

export const FoldView: React.FC<FoldViewProps> = ({ transactions, onAddTransaction }) => {
  // Calcular totales
  const incomeTotal = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenseTotal = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const balance = incomeTotal - expenseTotal;

  const handleVoiceTransaction = async (voiceTransaction: {
    type: 'income' | 'expense';
    description: string;
    amount: number;
  }) => {
    await onAddTransaction({
      ...voiceTransaction,
      category: voiceTransaction.type === 'income' ? 'Ingreso' : 'Gasto',
      date: new Date(),
      tags: [],
    });
  };

  return (
    <div className="p-2 mx-auto max-w-md text-center">
      <h1 className="text-lg font-bold mb-2">Mis Finanzas</h1>
      
      {/* Montos en fila con tamaño y padding reducidos */}
      <div className="flex justify-between mb-3 text-xs">
        <div className="bg-green-100 p-2 rounded-lg shadow flex-1 mx-1">
          <h3 className="text-green-800 font-semibold text-xs">Ingresos</h3>
          <p className="text-base font-bold text-green-600">€{incomeTotal.toFixed(2)}</p>
        </div>
        
        <div className="bg-red-100 p-2 rounded-lg shadow flex-1 mx-1">
          <h3 className="text-red-800 font-semibold text-xs">Gastos</h3>
          <p className="text-base font-bold text-red-600">€{expenseTotal.toFixed(2)}</p>
        </div>
        
        <div className={`${balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'} p-2 rounded-lg shadow flex-1 mx-1`}>
          <h3 className={`${balance >= 0 ? 'text-blue-800' : 'text-orange-800'} font-semibold text-xs`}>Balance</h3>
          <p className={`text-base font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            €{balance.toFixed(2)}
          </p>
        </div>
      </div>
      
      {/* Gráfico de torta */}
      <div className="mx-auto h-40 mb-3">
        <PieChart transactions={transactions} />
      </div>
      
      {/* Solo opción de voz */}
      <div className="mt-2">
        <VoiceInput onTransactionRecognized={handleVoiceTransaction} />
      </div>
    </div>
  );
}; 