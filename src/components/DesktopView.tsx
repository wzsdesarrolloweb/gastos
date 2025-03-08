import React, { useState } from 'react';
import { PieChart } from './PieChart';
import { FinancialSummary } from './FinancialSummary';
import { TransactionsTable } from './TransactionsTable';
import { TransactionForm } from './TransactionForm';
import { VoiceInput } from './VoiceInput';
import { Transaction } from '../types';

interface DesktopViewProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, '_id' | 'userId'>) => Promise<void>;
  onEditTransaction: (id: string, transaction: Omit<Transaction, '_id' | 'userId'>) => Promise<void>;
  onDeleteTransaction: (id: string) => Promise<void>;
}

export const DesktopView: React.FC<DesktopViewProps> = ({
  transactions,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [formKey, setFormKey] = useState(0); // Clave para forzar el re-renderizado del formulario

  const handleEdit = (transaction: Transaction) => {
    // Crear una copia profunda de la transacción para evitar problemas de referencia
    setEditingTransaction({...transaction});
    // Incrementar la clave para forzar el re-renderizado del formulario
    setFormKey(prevKey => prevKey + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (transaction: Omit<Transaction, '_id' | 'userId'>) => {
    if (editingTransaction) {
      await onEditTransaction(editingTransaction._id!, transaction);
      setEditingTransaction(undefined);
    } else {
      await onAddTransaction(transaction);
      // Forzar el re-renderizado del formulario para limpiarlo
      setFormKey(prevKey => prevKey + 1);
    }
  };

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

  const handleCancel = () => {
    setEditingTransaction(undefined);
    // Incrementar la clave para forzar el re-renderizado del formulario
    setFormKey(prevKey => prevKey + 1);
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Mis Finanzas</h1>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2">
          <FinancialSummary transactions={transactions} />
          <div className="bg-white p-6 rounded-lg shadow mb-6 mx-auto">
            <div className="h-96">
              <PieChart transactions={transactions} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {editingTransaction ? 'Editar Transacción' : 'Nueva Transacción'}
          </h2>
          <TransactionForm
            key={formKey} // Usar la clave para forzar el re-renderizado
            transaction={editingTransaction}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
          <div className="mt-4 flex justify-center">
            <VoiceInput onTransactionRecognized={handleVoiceTransaction} />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Transacciones</h2>
        </div>
        
        <TransactionsTable
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={onDeleteTransaction}
        />
      </div>
    </div>
  );
}; 