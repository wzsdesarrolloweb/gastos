import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (transaction: Omit<Transaction, '_id' | 'userId'>) => void;
  onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSubmit,
  onCancel,
}) => {
  const [type, setType] = useState<'income' | 'expense'>(transaction?.type || 'expense');
  const [description, setDescription] = useState(transaction?.description || '');
  const [amount, setAmount] = useState(transaction?.amount ? Math.abs(transaction.amount).toString() : '');
  const [category, setCategory] = useState(transaction?.category || '');
  const [date, setDate] = useState(
    transaction?.date 
      ? new Date(transaction.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );

  // Actualizar los estados cuando cambia la transacción (para edición)
  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setDescription(transaction.description || '');
      setAmount(Math.abs(transaction.amount).toString());
      setCategory(transaction.category || '');
      setDate(new Date(transaction.date).toISOString().split('T')[0]);
    } else {
      // Resetear el formulario si no hay transacción (para creación)
      setType('expense');
      setDescription('');
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [transaction]);

  const resetForm = () => {
    setType('expense');
    setDescription('');
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalAmount = type === 'expense' 
      ? -Math.abs(parseFloat(amount)) 
      : Math.abs(parseFloat(amount));
    
    onSubmit({
      type,
      description,
      amount: finalAmount,
      category: type === 'income' ? 'Ingreso' : 'Gasto', // Categoría por defecto basada en el tipo
      date: new Date(date),
      tags: [],
    });

    // Si no estamos editando una transacción existente, limpiamos el formulario
    if (!transaction) {
      resetForm();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
        <div className="mt-1 flex space-x-4">
          <label className={`inline-flex items-center px-4 py-2 rounded-md border cursor-pointer transition-colors ${
            type === 'income' 
              ? 'bg-green-100 border-green-300 text-green-800' 
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}>
            <input
              type="radio"
              className="form-radio text-green-600"
              value="income"
              checked={type === 'income'}
              onChange={() => setType('income')}
            />
            <span className="ml-2 font-medium">Ingreso</span>
          </label>
          <label className={`inline-flex items-center px-4 py-2 rounded-md border cursor-pointer transition-colors ${
            type === 'expense' 
              ? 'bg-red-100 border-red-300 text-red-800' 
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}>
            <input
              type="radio"
              className="form-radio text-red-600"
              value="expense"
              checked={type === 'expense'}
              onChange={() => setType('expense')}
            />
            <span className="ml-2 font-medium">Gasto</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Monto
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">€</span>
          </div>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md ${
              type === 'income' ? 'focus:ring-green-500 focus:border-green-500' : 'focus:ring-red-500 focus:border-red-500'
            }`}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Fecha
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div className="flex justify-center space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white transition-colors ${
            type === 'income' 
              ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
              : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
          }`}
        >
          {transaction ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}; 