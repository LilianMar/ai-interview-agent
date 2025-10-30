import React from 'react';
import { Rocket } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center animate-fade-in-up">
      <div className="max-w-3xl mx-auto bg-gray-800/50 rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-gray-700">
        <h2 className="text-4xl font-extrabold text-white mb-4">
          Bienvenido a <span className="text-cyan-400">PrepAI</span>
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Tu mentor personal para entrevistas técnicas. Refuerza tus conocimientos, simula entrevistas reales y sigue tu progreso para conseguir el trabajo de tus sueños.
        </p>
        <button
          onClick={onStart}
          className="bg-cyan-500 text-white font-bold py-3 px-8 rounded-full hover:bg-cyan-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center mx-auto space-x-2 text-lg"
        >
          <Rocket className="h-5 w-5" />
          <span>Comenzar preparación</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;