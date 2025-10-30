import React, { useState, useEffect, useCallback } from 'react';
import { getTopicsForRole, getConceptExplanation } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { Topic, Explanation } from '../types';
import { ArrowRight } from 'lucide-react';

interface TopicSelectionScreenProps {
  role: string;
  onTopicsSelect: (topics: Topic[]) => void;
}

const TopicSelectionScreen: React.FC<TopicSelectionScreenProps> = ({ role, onTopicsSelect }) => {
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const topics = await getTopicsForRole(role);
        setAvailableTopics(topics);
      } catch (err) {
        setError('No se pudieron cargar los temas. Por favor, inténtalo de nuevo.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopics();
  }, [role]);

  const handleToggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleContinue = async () => {
    if (selectedTopics.length === 0) return;
    setIsProcessing(true);
    setError(null);
    try {
        const topicPromises = selectedTopics.map(title => 
            getConceptExplanation(title, role).then(explanation => ({
                title,
                explanation: explanation || { 
                    definition: "No se pudo generar explicación.", 
                    details: "", 
                    keyConcepts: [],
                    useCases: [],
                    resources: [] 
                }
            }))
        );
        const resolvedTopics = await Promise.all(topicPromises);
        onTopicsSelect(resolvedTopics);
    } catch (err) {
        setError("Error al generar las explicaciones de los temas. Inténtalo de nuevo.");
        console.error(err);
        setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text={`Generando temas para ${role}...`} />;
  }

  if (isProcessing) {
    return <LoadingSpinner text="Preparando tus materiales de estudio..." />;
  }

  return (
    <div className="animate-fade-in-up">
      <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center mb-2 text-cyan-400">Paso 2: Temas Esenciales</h2>
        <p className="text-center text-gray-400 mb-8">Selecciona los temas que quieres reforzar para el rol de <span className="font-semibold text-white">{role}</span>.</p>
        
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {availableTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => handleToggleTopic(topic)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedTopics.includes(topic)
                  ? 'bg-cyan-500/20 border-cyan-400 text-white'
                  : 'bg-gray-700/50 border-gray-700 hover:border-gray-500 text-gray-300'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
        
        <div className="text-center">
            <button
                onClick={handleContinue}
                disabled={selectedTopics.length === 0}
                className="bg-cyan-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-cyan-600 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-600 disabled:cursor-not-allowed mx-auto"
            >
                <span>Revisar conceptos</span>
                <ArrowRight className="h-5 w-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default TopicSelectionScreen;