import React, { useState, useEffect } from 'react';

interface VoiceInputProps {
  onTransactionRecognized: (transaction: {
    type: 'income' | 'expense';
    description: string;
    amount: number;
  }) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTransactionRecognized }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [processingMessage, setProcessingMessage] = useState('');
  
  // Detectar si estamos en una pantalla pequeña (fold)
  const isFoldScreen = window.innerWidth <= 384;

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }

    const recognitionInstance = new (window as any).webkitSpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.lang = 'es-ES';

    recognitionInstance.onresult = (event: any) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTranscript(text);
      
      // Procesar el comando de voz automáticamente
      setProcessingMessage('Procesando comando...');
      
      // Analizar el comando ultra simplificado
      const result = parseUltraSimpleCommand(text);
      
      if (result.success && result.transaction) {
        // Crear la transacción
        onTransactionRecognized(result.transaction);
        setProcessingMessage(`¡${result.transaction.type === 'income' ? 'Ingreso' : 'Gasto'} de €${Math.abs(result.transaction.amount).toFixed(2)} creado!`);
      } else {
        setProcessingMessage(`Error: ${result.error}`);
      }
      
      // Limpiar después de 3 segundos
      setTimeout(() => {
        setProcessingMessage('');
        setTranscript('');
      }, 3000);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [onTransactionRecognized]);

  // Función para convertir texto de números en español a valores numéricos
  const textToNumber = (text: string): number => {
    // Eliminar palabras no numéricas comunes
    const cleanText = text
      .replace(/euros|euro|€/g, '')
      .replace(/y/g, '')
      .replace(/con/g, '')
      .replace(/coma/g, '.')
      .replace(/punto/g, '')
      .trim();
    
    // Reemplazar palabras numéricas por sus equivalentes
    let processedText = cleanText
      // Millones
      .replace(/diez millones/g, '10000000')
      .replace(/nueve millones/g, '9000000')
      .replace(/ocho millones/g, '8000000')
      .replace(/siete millones/g, '7000000')
      .replace(/seis millones/g, '6000000')
      .replace(/cinco millones/g, '5000000')
      .replace(/cuatro millones/g, '4000000')
      .replace(/tres millones/g, '3000000')
      .replace(/dos millones/g, '2000000')
      .replace(/un millón|un millon|millón|millon/g, '1000000')
      // Miles
      .replace(/novecientos mil/g, '900000')
      .replace(/ochocientos mil/g, '800000')
      .replace(/setecientos mil/g, '700000')
      .replace(/seiscientos mil/g, '600000')
      .replace(/quinientos mil/g, '500000')
      .replace(/cuatrocientos mil/g, '400000')
      .replace(/trescientos mil/g, '300000')
      .replace(/doscientos mil/g, '200000')
      .replace(/cien mil/g, '100000')
      .replace(/mil/g, '1000')
      // Centenas
      .replace(/novecientos/g, '900')
      .replace(/ochocientos/g, '800')
      .replace(/setecientos/g, '700')
      .replace(/seiscientos/g, '600')
      .replace(/quinientos/g, '500')
      .replace(/cuatrocientos/g, '400')
      .replace(/trescientos/g, '300')
      .replace(/doscientos/g, '200')
      .replace(/cien/g, '100')
      // Decenas y unidades
      .replace(/noventa/g, '90')
      .replace(/ochenta/g, '80')
      .replace(/setenta/g, '70')
      .replace(/sesenta/g, '60')
      .replace(/cincuenta/g, '50')
      .replace(/cuarenta/g, '40')
      .replace(/treinta/g, '30')
      .replace(/veinte/g, '20')
      .replace(/diez/g, '10')
      .replace(/nueve/g, '9')
      .replace(/ocho/g, '8')
      .replace(/siete/g, '7')
      .replace(/seis/g, '6')
      .replace(/cinco/g, '5')
      .replace(/cuatro/g, '4')
      .replace(/tres/g, '3')
      .replace(/dos/g, '2')
      .replace(/uno|un/g, '1')
      .replace(/cero/g, '0');
    
    // Extraer solo los dígitos y puntos decimales
    const digitsOnly = processedText.replace(/[^\d.]/g, '');
    
    // Si no hay dígitos, devolver 0
    if (!digitsOnly) return 0;
    
    // Convertir a número
    return parseFloat(digitsOnly);
  };

  // Función para analizar el comando ultra simplificado
  const parseUltraSimpleCommand = (text: string): { 
    success: boolean; 
    transaction?: { type: 'income' | 'expense'; description: string; amount: number }; 
    error?: string 
  } => {
    // Verificar el tipo
    let type: 'income' | 'expense';
    let remainingText = text;
    
    if (text.includes('ingreso')) {
      type = 'income';
      remainingText = text.replace(/ingreso/g, '').trim();
    } else if (text.includes('gasto')) {
      type = 'expense';
      remainingText = text.replace(/gasto/g, '').trim();
    } else {
      return { success: false, error: "Debe incluir la palabra 'ingreso' o 'gasto'" };
    }
    
    // Todo lo demás es considerado parte del número
    const amount = textToNumber(remainingText);
    
    // Verificar que se obtuvo un número válido
    if (amount <= 0) {
      return { success: false, error: "No se pudo determinar un monto válido" };
    }
    
    // Crear la transacción con descripción vacía
    return { 
      success: true, 
      transaction: { 
        type, 
        description: '', // Descripción vacía
        amount 
      } 
    };
  };

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      try {
        recognition?.start();
        setIsListening(true);
        setTranscript('');
        setProcessingMessage('');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={toggleListening}
        className={`flex items-center ${isFoldScreen ? 'px-2 py-1 text-xs' : 'px-4 py-2'} rounded-md shadow-sm transition-all ${
          isListening 
            ? 'bg-red-500 text-white hover:bg-red-600 ring-2 ring-red-300' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${isFoldScreen ? 'h-3 w-3 mr-1' : 'h-5 w-5 mr-2'} ${isListening ? 'animate-pulse' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
            clipRule="evenodd"
          />
        </svg>
        {isListening ? 'Escuchando...' : isFoldScreen ? 'Voz' : 'Comando de Voz'}
      </button>
      
      {transcript && (
        <div className={`mt-2 ${isFoldScreen ? 'text-xs' : 'text-sm'} text-gray-600 bg-gray-100 p-2 rounded-md max-w-xs text-center`}>
          <p className="font-medium">Comando reconocido:</p>
          <p className="italic">"{transcript}"</p>
        </div>
      )}
      
      {processingMessage && (
        <div className={`mt-2 ${isFoldScreen ? 'text-xs' : 'text-sm'} p-2 rounded-md max-w-xs text-center ${
          processingMessage.includes('creado') 
            ? 'bg-green-100 text-green-800' 
            : processingMessage.includes('Error') 
              ? 'bg-red-100 text-red-800' 
              : 'bg-blue-100 text-blue-800'
        }`}>
          {processingMessage}
        </div>
      )}
      
      {!isFoldScreen && (
        <div className="mt-2 text-xs text-gray-600 max-w-xs text-center">
          <p className="font-semibold">ESTRUCTURA ULTRA SIMPLE:</p>
          <p>Solo di "ingreso" o "gasto" y el monto</p>
          <p>Ejemplos:</p>
          <p>"ingreso 1000" o "gasto 50000"</p>
          <p>"ingreso un millón" o "gasto quinientos mil"</p>
          <p className="mt-1 text-blue-600 font-medium">La descripción se puede agregar después editando la transacción</p>
        </div>
      )}
      
      {!('webkitSpeechRecognition' in window) && (
        <div className={`mt-2 ${isFoldScreen ? 'text-xs' : 'text-sm'} text-red-600`}>
          Tu navegador no soporta reconocimiento de voz
        </div>
      )}
    </div>
  );
}; 