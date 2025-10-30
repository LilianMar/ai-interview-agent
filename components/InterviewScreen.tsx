import React, { useState, useEffect } from 'react';
import { generateInterviewQuestions, generateInterviewFeedback } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { Question, InterviewResult, Feedback, Topic } from '../types';
import { ArrowRight, Check, X } from 'lucide-react';

interface InterviewScreenProps {
  role: string;
  topics: Topic[];
  questionCount: number;
  onInterviewComplete: (result: InterviewResult) => void;
}

const InterviewScreen: React.FC<InterviewScreenProps> = ({ role, topics, questionCount, onInterviewComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const topicTitles = topics.map(t => t.title);
        const fetchedQuestions = await generateInterviewQuestions(role, topicTitles, questionCount);
        if (fetchedQuestions && fetchedQuestions.length > 0) {
            setQuestions(fetchedQuestions);
        } else {
            setError("No se pudieron generar las preguntas. Por favor, vuelve a intentarlo.");
        }
      } catch (err) {
        setError('Error al cargar la entrevista. Por favor, inténtalo de nuevo.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, topics, questionCount]);

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    setQuestions(prev => {
        const newQuestions = [...prev];
        newQuestions[currentQuestionIndex].userAnswerIndex = index;
        return newQuestions;
    });
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      await finishInterview();
    }
  };
  
  const finishInterview = async () => {
    setIsFinishing(true);
    const correctAnswers = questions.filter(q => q.userAnswerIndex === q.correctAnswerIndex).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    const incorrectQuestions = questions.filter(q => q.userAnswerIndex !== q.correctAnswerIndex);
    const feedback = await generateInterviewFeedback(role, score, incorrectQuestions);

    const result: InterviewResult = {
      score,
      questions,
      feedback: feedback || { strengths: 'N/A', areasToImprove: 'N/A', suggestedResources: [] }
    };
    onInterviewComplete(result);
  };

  if (isLoading) return <LoadingSpinner text="Generando tu entrevista personalizada..." />;
  if (isFinishing) return <LoadingSpinner text="Calculando tus resultados y generando feedback..." />;
  if (error) return <p className="text-red-400 text-center">{error}</p>;
  if (questions.length === 0) return <p className="text-center">No hay preguntas disponibles.</p>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="animate-fade-in-up">
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-center mb-2 text-cyan-400">Simulación de Entrevista</h2>
            <p className="text-center text-gray-400 mb-2">Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-8">
                <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
            </div>

            <p className="text-xl text-white text-center mb-8">{currentQuestion.question}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                    const isCorrect = index === currentQuestion.correctAnswerIndex;
                    const isSelected = index === selectedAnswer;
                    let buttonClass = 'bg-gray-700/50 border-gray-700 hover:border-gray-500';

                    if (isAnswered) {
                        if (isCorrect) {
                            buttonClass = 'bg-green-500/30 border-green-500';
                        } else if (isSelected && !isCorrect) {
                            buttonClass = 'bg-red-500/30 border-red-500';
                        } else {
                            buttonClass = 'bg-gray-700/50 border-gray-700 opacity-50';
                        }
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={isAnswered}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left w-full flex justify-between items-center ${buttonClass}`}
                        >
                            <span>{option}</span>
                            {isAnswered && isCorrect && <Check className="h-5 w-5 text-green-400" />}
                            {isAnswered && isSelected && !isCorrect && <X className="h-5 w-5 text-red-400" />}
                        </button>
                    );
                })}
            </div>

            {isAnswered && (
                <div className="text-center mt-8">
                    <button
                        onClick={handleNextQuestion}
                        className="bg-cyan-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-cyan-600 transition-colors flex items-center justify-center space-x-2 mx-auto"
                    >
                        <span>{currentQuestionIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Entrevista'}</span>
                         <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default InterviewScreen;