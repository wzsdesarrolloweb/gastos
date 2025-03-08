import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Transaction } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  transactions: Transaction[];
}

export const PieChart: React.FC<PieChartProps> = ({ transactions }) => {
  const incomeTotal = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenseTotal = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Colores consistentes con los usados en FinancialSummary
  // Estos son los colores de Tailwind que corresponden a las clases usadas
  const incomeColor = '#4ade80'; // verde claro (green-400)
  const incomeBorderColor = '#16a34a'; // verde oscuro (green-600)
  const expenseColor = '#f87171'; // rojo claro (red-400)
  const expenseBorderColor = '#dc2626'; // rojo oscuro (red-600)

  const data = {
    labels: ['Ingresos', 'Gastos'],
    datasets: [
      {
        data: [incomeTotal, expenseTotal],
        backgroundColor: [incomeColor, expenseColor],
        borderColor: [incomeBorderColor, expenseBorderColor],
        borderWidth: 1,
      },
    ],
  };

  // Detectar si estamos en una pantalla pequeña (fold), mediana (mobile) o grande (desktop)
  const isFoldScreen = window.innerWidth <= 384;
  const isDesktopScreen = window.innerWidth >= 769;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: isFoldScreen ? 10 : isDesktopScreen ? 14 : 12,
            weight: 'bold' as const
          },
          boxWidth: isFoldScreen ? 10 : isDesktopScreen ? 20 : 15,
          padding: isFoldScreen ? 5 : isDesktopScreen ? 15 : 10
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0) > 0
              ? Math.round((value / context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)) * 100)
              : 0;
            return `${label}: €${value.toFixed(2)} (${percentage}%)`;
          }
        },
        bodyFont: {
          size: isFoldScreen ? 10 : isDesktopScreen ? 14 : 12
        },
        titleFont: {
          size: isFoldScreen ? 10 : isDesktopScreen ? 16 : 12
        },
        padding: isFoldScreen ? 6 : isDesktopScreen ? 12 : 8
      }
    },
    // Aumentar el tamaño del gráfico en pantallas de escritorio
    layout: {
      padding: {
        top: isFoldScreen ? 0 : isDesktopScreen ? 20 : 10,
        bottom: isFoldScreen ? 0 : isDesktopScreen ? 20 : 10,
        left: isFoldScreen ? 0 : isDesktopScreen ? 20 : 10,
        right: isFoldScreen ? 0 : isDesktopScreen ? 20 : 10
      }
    },
    // Hacer el gráfico más grande en pantallas de escritorio
    elements: {
      arc: {
        borderWidth: isFoldScreen ? 1 : isDesktopScreen ? 2 : 1,
      }
    },
  };

  return (
    <div className="h-full w-full mx-auto">
      <Pie data={data} options={options} />
    </div>
  );
}; 