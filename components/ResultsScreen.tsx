import React, { useState } from 'react';
import { InterviewResult, Topic, Question, GoogleSheetRow } from '../types';
import { PASSING_SCORE_PERCENTAGE } from '../constants';
import { saveInterviewResults } from '../services/googleSheetsService';
import { Check, X, AlertTriangle, ArrowRight, BookOpen, Save } from 'lucide-react';

interface ResultsScreenProps {
  interviewResult: InterviewResult;
  role: string;
  topics: Topic[];
  onComplete: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ interviewResult, role, topics, onComplete }) => {
  const { score, questions, feedback } = interviewResult;
  const isPassing = score >= PASSING_SCORE_PERCENTAGE;

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [hasSaved, setHasSaved] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !email.trim()) {
      setIsError(true);
      setSaveMessage('El nombre y el correo electrónico son obligatorios.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setIsError(true);
      setSaveMessage('Por favor, introduce un correo electrónico válido.');
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);
    setIsError(false);

    const dataToSave: GoogleSheetRow = {
      timestamp: new Date().toISOString(),
      userName: userName,
      email: email,
      role: role,
      topics: topics.map(t => t.title).join(', '),
      score: score,
      result: isPassing ? 'Aprobado' : 'No Aprobado',
      areasToReinforce: feedback.areasToImprove,
    };
    
    const result = await saveInterviewResults(dataToSave);

    setIsSaving(false);
    if (result.success) {
      setHasSaved(true);
      setIsError(false);
      setSaveMessage('¡Progreso guardado con éxito!');
    } else {
      setHasSaved(false);
      setIsError(true);
      setSaveMessage(result.message || 'Ocurrió un error desconocido al guardar.');
    }
  };

  const getOptionClassName = (question: Question, optionIndex: number) => {
    const { correctAnswerIndex, userAnswerIndex } = question;
    const isCorrect = optionIndex === correctAnswerIndex;
    const isUserAnswer = optionIndex === userAnswerIndex;

    if (isCorrect) return 'bg-green-500/20 border-green-500';
    if (isUserAnswer && !isCorrect) return 'bg-red-500/20 border-red-500';
    return 'bg-gray-700/50 border-gray-700';
  };

  return (
    <div className="animate-fade-in-up">
      <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center mb-4 text-cyan-400">Resultados de la Simulación</h2>

        {/* Score Section */}
        <div className={`text-center p-6 rounded-lg mb-8 border-2 ${isPassing ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'}`}>
          <h3 className="text-xl font-semibold mb-2">Tu Puntuación:</h3>
          <p className={`text-6xl font-bold ${isPassing ? 'text-green-400' : 'text-red-400'}`}>{score}%</p>
          <p className="mt-2 text-lg">
            {isPassing ? "¡Felicidades! Has aprobado." : "Sigue practicando. ¡Puedes mejorar!"}
          </p>
        </div>

        {/* Feedback Section */}
        <div className="mb-8 space-y-4">
          <h3 className="text-2xl font-bold text-center mb-4">Feedback Personalizado</h3>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-2 flex items-center text-green-400"><Check className="mr-2"/>Fortalezas</h4>
            <p className="text-gray-300">{feedback.strengths}</p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-2 flex items-center text-yellow-400"><AlertTriangle className="mr-2"/>Áreas de Mejora</h4>
            <p className="text-gray-300">{feedback.areasToImprove}</p>
          </div>
           {feedback.suggestedResources && feedback.suggestedResources.length > 0 && (
             <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg mb-2 flex items-center text-cyan-400"><BookOpen className="mr-2"/>Recursos Sugeridos</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {feedback.suggestedResources.map((resource, index) => (
                   <li key={index}><a href={resource} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{resource}</a></li>
                ))}
              </ul>
            </div>
           )}
        </div>

        {/* Save & Continue Section */}
        <div className="mt-8">
            {!hasSaved ? (
                <form onSubmit={handleSave} className="w-full max-w-lg mx-auto bg-gray-700/50 p-6 rounded-lg text-center">
                    <h3 className="text-xl font-semibold mb-4 text-white">Guarda tu progreso para el futuro</h3>
                    <div className="space-y-4 mb-6">
                        <input 
                            type="text" 
                            placeholder="Tu nombre" 
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <input 
                            type="email" 
                            placeholder="Tu correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full bg-cyan-500 text-white font-bold py-3 px-8 rounded-full hover:bg-cyan-600 transition-all duration-300 disabled:bg-gray-600 flex items-center justify-center space-x-2"
                    >
                        {isSaving ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                        <>
                            <Save className="h-5 w-5" />
                            <span>Guardar Progreso</span>
                        </>
                        )}
                    </button>
                    {saveMessage && (
                        <p className={`mt-4 text-sm ${isError ? 'text-red-400' : 'text-green-400'}`}>{saveMessage}</p>
                    )}
                </form>
            ) : (
                <div className="text-center">
                    <p className="text-green-400 mb-4">{saveMessage}</p>
                    <button
                        onClick={onComplete}
                        className="bg-cyan-500 text-white font-bold py-3 px-8 rounded-full hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto space-x-2"
                    >
                        <span>Continuar</span>
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>

        {/* Question Review Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-center mb-4">Revisión de Preguntas</h3>
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                <p className="font-semibold mb-3 text-white">
                  {q.userAnswerIndex === q.correctAnswerIndex 
                    ? <Check className="inline mr-2 h-5 w-5 text-green-400"/> 
                    : <X className="inline mr-2 h-5 w-5 text-red-400"/>
                  }
                  Pregunta {index + 1}: {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((option, optionIndex) => (
                    <div key={optionIndex} className={`p-3 rounded-md border ${getOptionClassName(q, optionIndex)}`}>
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsScreen;
