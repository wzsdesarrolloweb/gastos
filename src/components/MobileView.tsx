import React, { useState, useEffect } from 'react';
import { PieChart } from './PieChart';
import { FinancialSummary } from './FinancialSummary';
import { TransactionsTable } from './TransactionsTable';
import { TransactionForm } from './TransactionForm';
import { VoiceInput } from './VoiceInput';
import { Transaction } from '../types';

interface MobileViewProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, '_id' | 'userId'>) => Promise<void>;
  onEditTransaction: (id: string, transaction: Omit<Transaction, '_id' | 'userId'>) => Promise<void>;
  onDeleteTransaction: (id: string) => Promise<void>;
}

export const MobileView: React.FC<MobileViewProps> = ({
  transactions,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [formKey, setFormKey] = useState(0);

  const handleEdit = (transaction: Transaction) => {
    setFormKey(prevKey => prevKey + 1);
    setEditingTransaction({...transaction});
    setShowForm(true);
  };

  const handleSubmit = async (transaction: Omit<Transaction, '_id' | 'userId'>) => {
    if (editingTransaction) {
      await onEditTransaction(editingTransaction._id!, transaction);
    } else {
      await onAddTransaction(transaction);
    }
    setShowForm(false);
    setEditingTransaction(undefined);
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
    setShowForm(false);
    setEditingTransaction(undefined);
  };

  return (
    <div className="p-4 mx-auto max-w-xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Mis Finanzas</h1>
      
      <div className="mb-6">
        <FinancialSummary transactions={transactions} />
      </div>
      
      <div className="mb-6 mx-auto max-w-md">
        <PieChart transactions={transactions} />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transacciones</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditingTransaction(undefined);
              setFormKey(prevKey => prevKey + 1);
              setShowForm(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Añadir
          </button>
          <VoiceInput onTransactionRecognized={handleVoiceTransaction} />
        </div>
      </div>
      
      {showForm ? (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">
            {editingTransaction ? 'Editar Transacción' : 'Nueva Transacción'}
          </h3>
          <TransactionForm
            key={formKey}
            transaction={editingTransaction}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : null}
      
      <TransactionsTable
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={onDeleteTransaction}
      />
    </div>
  );
}; 