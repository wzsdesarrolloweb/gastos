import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Transaction } from '../types';

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ 
  transactions, 
  onEdit, 
  onDelete 
}) => {
  // Ordenar transacciones por fecha (más reciente primero)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Definimos colores específicos para asegurarnos de que se apliquen
  const incomeTextColor = "text-green-600";
  const incomeBgColor = "bg-green-100";
  const expenseTextColor = "text-red-600";
  const expenseBgColor = "bg-red-100";

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoría
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Monto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedTransactions.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No hay transacciones registradas
              </td>
            </tr>
          ) : (
            sortedTransactions.map((transaction) => (
              <tr key={transaction._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(transaction.date), 'dd MMM yyyy', { locale: es })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transaction.type === 'income' ? `${incomeBgColor} text-green-800` : `${expenseBgColor} text-red-800`
                  }`}>
                    {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded-md">
                    {transaction.category}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  transaction.type === 'income' ? incomeTextColor : expenseTextColor
                }`}>
                  €{Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(transaction._id!)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}; 