import React from 'react';

export const TestColors: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Prueba de Colores</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-green-800 font-semibold">Título Verde</h3>
          <p className="text-green-600">Texto verde</p>
        </div>
        
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="text-red-800 font-semibold">Título Rojo</h3>
          <p className="text-red-600">Texto rojo</p>
        </div>
        
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-blue-800 font-semibold">Título Azul</h3>
          <p className="text-blue-600">Texto azul</p>
        </div>
        
        <div className="bg-orange-100 p-4 rounded-lg">
          <h3 className="text-orange-800 font-semibold">Título Naranja</h3>
          <p className="text-orange-600">Texto naranja</p>
        </div>
      </div>
    </div>
  );
}; 