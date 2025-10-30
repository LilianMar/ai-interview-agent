import React, { useState, useEffect } from 'react';
import { getCareerSuggestions } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { CareerSuggestion } from '../types';
import { Briefcase, DollarSign, Lightbulb } from 'lucide-react';

interface CareerSuggestionsProps {
  role: string;
  onRestart: () => void;
}

const CareerSuggestionsScreen: React.FC<CareerSuggestionsProps> = ({ role, onRestart }) => {
  const [suggestions, setSuggestions] = useState<CareerSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getCareerSuggestions(role);
      setSuggestions(result);
      setShowSuggestions(true);
    } catch (err) {
      setError("No se pudieron cargar las sugerencias de carrera. Por favor, inténtalo de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShowSuggestions = () => {
      fetchSuggestions();
  };

  return (
    <div className="animate-fade-in-up text-center">
      <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 backdrop-blur-sm">
        
        {!showSuggestions && !isLoading && (
            <div>
                <h2 className="text-2xl font-bold mb-4">¿Exploramos tu futuro?</h2>
                <p className="text-gray-300 mb-6">¿Deseas conocer roles relacionados con alta demanda laboral y mejores salarios en el mercado actual?</p>
                <div className="flex justify-center gap-4">
                    <button onClick={handleShowSuggestions} className="bg-cyan-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-cyan-600 transition-colors">
                        Sí, muéstrame
                    </button>
                    <button onClick={onRestart} className="bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors">
                        No, gracias
                    </button>
                </div>
            </div>
        )}

        {isLoading && <LoadingSpinner text="Buscando oportunidades de carrera..." />}

        {showSuggestions && (
            <div>
                <h2 className="text-3xl font-bold text-center mb-6 text-cyan-400">Oportunidades de Carrera</h2>
                {error && <p className="text-red-400 mb-4">{error}</p>}
                <div className="space-y-6 text-left">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                            <h3 className="text-xl font-bold mb-2 text-white flex items-center"><Briefcase className="h-5 w-5 mr-2 text-cyan-400" />{suggestion.role}</h3>
                            <p className="text-gray-300 mb-3">{suggestion.description}</p>
                            <div className="bg-gray-900/50 p-3 rounded-md">
                               <p className="text-sm text-gray-400 flex"><Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-yellow-400 flex-shrink-0" /> <span className="font-semibold text-gray-300 mr-1">Relevancia:</span> {suggestion.relevance}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={onRestart} className="mt-8 bg-cyan-500 text-white font-bold py-3 px-8 rounded-full hover:bg-cyan-600 transition-all duration-300">
                    Realizar otra simulación
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default CareerSuggestionsScreen;