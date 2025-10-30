import React, { useState } from 'react';
import { Topic } from '../types';
import { QUESTION_COUNTS } from '../constants';
import { BookOpen, Code, Link, ChevronDown, Lightbulb, Briefcase, FileText } from 'lucide-react';

interface GuidedReviewScreenProps {
  role: string;
  topics: Topic[];
  onStartInterview: (questionCount: number) => void;
}

const AccordionItem: React.FC<{ topic: Topic; isOpen: boolean; onClick: () => void }> = ({ topic, isOpen, onClick }) => {
    const { explanation } = topic;
    return (
        <div className="border-b border-gray-700">
            <h2>
                <button
                    type="button"
                    className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-200 hover:bg-gray-800"
                    onClick={onClick}
                >
                    <span className="flex items-center text-lg">
                        <BookOpen className="mr-3 h-6 w-6 text-cyan-400" />
                        {topic.title}
                    </span>
                    <ChevronDown className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </h2>
            {isOpen && (
                <div className="p-6 border-t border-gray-700 bg-gray-900/50 space-y-6">
                    {/* Definition */}
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-bold text-gray-100 mb-2 flex items-center"><FileText className="mr-2 h-5 w-5 text-cyan-400" />Definición</h4>
                        <p className="text-gray-300">{explanation.definition}</p>
                    </div>

                    {/* Key Concepts */}
                    {explanation.keyConcepts && explanation.keyConcepts.length > 0 && (
                        <div>
                            <h4 className="font-bold text-gray-100 mb-3 flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />Conceptos Clave</h4>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 pl-4">
                                {explanation.keyConcepts.map((concept, index) => (
                                    <li key={index}>{concept}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {/* Use Cases */}
                    {explanation.useCases && explanation.useCases.length > 0 && (
                         <div>
                            <h4 className="font-bold text-gray-100 mb-3 flex items-center"><Briefcase className="mr-2 h-5 w-5 text-green-400" />Casos de Uso</h4>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 pl-4">
                                {explanation.useCases.map((useCase, index) => (
                                    <li key={index}>{useCase}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {/* Detailed Explanation */}
                     <div>
                        <h4 className="font-bold text-gray-100 mb-2">Explicación Detallada</h4>
                        <p className="text-gray-300 whitespace-pre-wrap">{explanation.details}</p>
                    </div>

                    {/* Code Example */}
                    {explanation.codeExample && (
                        <div>
                            <h4 className="font-bold text-gray-100 mb-2 flex items-center"><Code className="mr-2 h-5 w-5" />Ejemplo de Código</h4>
                            <pre className="bg-gray-900 p-4 rounded-md text-sm text-cyan-300 overflow-x-auto"><code>{explanation.codeExample}</code></pre>
                        </div>
                    )}

                    {/* Resources */}
                    {explanation.resources && explanation.resources.length > 0 && (
                        <div>
                            <h4 className="font-bold text-gray-100 mb-2 flex items-center"><Link className="mr-2 h-5 w-5" />Recursos Adicionales</h4>
                            <ul className="list-disc list-inside text-gray-300 space-y-1 pl-4">
                                {explanation.resources.map((resource, index) => (
                                    <li key={index}><a href={resource} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{resource}</a></li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


const GuidedReviewScreen: React.FC<GuidedReviewScreenProps> = ({ topics, onStartInterview }) => {
    const [openTopicIndex, setOpenTopicIndex] = useState<number | null>(0);
    const [questionCount, setQuestionCount] = useState<number>(QUESTION_COUNTS[0]);

    const handleAccordionClick = (index: number) => {
        setOpenTopicIndex(openTopicIndex === index ? null : index);
    };

    return (
        <div className="animate-fade-in-up">
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-center mb-2 text-cyan-400">Paso 3: Revisión de Conceptos</h2>
                <p className="text-center text-gray-400 mb-8">Repasa los conceptos clave. Haz clic en cada tema para ver los detalles.</p>
                
                <div className="mb-8 rounded-lg overflow-hidden border border-gray-700">
                    {topics.map((topic, index) => (
                        <AccordionItem 
                            key={topic.title} 
                            topic={topic}
                            isOpen={openTopicIndex === index}
                            onClick={() => handleAccordionClick(index)}
                        />
                    ))}
                </div>

                <div className="bg-gray-700/50 p-6 rounded-lg text-center">
                    <h3 className="text-xl font-semibold mb-4 text-white">¿Listo para probar tus conocimientos?</h3>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="flex items-center gap-3">
                            <label htmlFor="question-count" className="font-medium text-gray-300">Nº de preguntas:</label>
                             <select
                                id="question-count"
                                value={questionCount}
                                onChange={(e) => setQuestionCount(Number(e.target.value))}
                                className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                {QUESTION_COUNTS.map(count => <option key={count} value={count}>{count}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={() => onStartInterview(questionCount)}
                            className="bg-cyan-500 text-white font-bold py-3 px-8 rounded-full hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105"
                        >
                            Simular entrevista
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuidedReviewScreen;