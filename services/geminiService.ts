import { GoogleGenAI, Type } from "@google/genai";
import { Explanation, Question, Feedback, CareerSuggestion } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = "Eres PrepAI, un agente experto en preparación para entrevistas técnicas para ingenieros de software. Tu tono es profesional, motivador y alentador. Proporcionas información clara, concisa y precisa para ayudar a los usuarios a tener éxito. Siempre respondes en español.";

const safeJsonParse = <T,>(jsonString: string): T | null => {
    try {
        return JSON.parse(jsonString.replace(/```json|```/g, '').trim()) as T;
    } catch (error) {
        console.error("Failed to parse JSON:", error, "Raw string:", jsonString);
        return null;
    }
};

export const getTopicsForRole = async (role: string): Promise<string[]> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Dado el rol de ingeniería de software de '${role}', genera una lista de 5 a 7 temas técnicos esenciales para la preparación de entrevistas. Responde con un array JSON de strings.`,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        },
    });
    
    const json = safeJsonParse<string[]>(response.text);
    return json || [];
};

export const getConceptExplanation = async (topic: string, role: string): Promise<Explanation | null> => {
     const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Explica el concepto técnico de '${topic}' para una entrevista de '${role}'. Proporciona: 
        1.  Una definición clara.
        2.  Una explicación detallada.
        3.  Una lista de 3 a 5 conceptos clave o ideas principales.
        4.  Una lista de 2 a 3 casos de uso prácticos o ejemplos del mundo real.
        5.  Un ejemplo de código conciso en un lenguaje relevante (ej. Python para Backend, JS para Frontend).
        6.  Una lista de 2 a 3 recursos (links) para un estudio más profundo.`,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    definition: { type: Type.STRING },
                    details: { type: Type.STRING },
                    keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                    useCases: { type: Type.ARRAY, items: { type: Type.STRING } },
                    codeExample: { type: Type.STRING },
                    resources: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["definition", "details", "keyConcepts", "useCases", "resources"]
            }
        },
    });
    
    return safeJsonParse<Explanation>(response.text);
};


export const generateInterviewQuestions = async (role: string, topics: string[], questionCount: number): Promise<Question[]> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Crea ${questionCount} preguntas de entrevista de opción múltiple para un '${role}' centrándote en los siguientes temas: ${topics.join(', ')}. Cada pregunta debe tener 4 opciones y una respuesta correcta.`,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        // FIX: Changed Type.NUMBER to Type.INTEGER for the index property.
                        correctAnswerIndex: { type: Type.INTEGER }
                    },
                    required: ["question", "options", "correctAnswerIndex"]
                }
            }
        },
    });

    const questions = safeJsonParse<Question[]>(response.text);
    return questions || [];
};

export const generateInterviewFeedback = async (role: string, score: number, incorrectAnswers: Question[]): Promise<Feedback | null> => {
    const incorrectTopics = [...new Set(incorrectAnswers.map(q => q.question))]; // This is a proxy for topics
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Un usuario que se prepara para una entrevista de '${role}' obtuvo una puntuación de ${score}%. Sus respuestas incorrectas estaban relacionadas con estas preguntas: ${incorrectTopics.join(', ')}. Proporciona retroalimentación personalizada. Identifica sus posibles fortalezas basándote en la puntuación. Señala las áreas de mejora a partir de las respuestas incorrectas. Sugiere recursos específicos para estudiar las áreas débiles.`,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    strengths: { type: Type.STRING },
                    areasToImprove: { type: Type.STRING },
                    suggestedResources: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["strengths", "areasToImprove", "suggestedResources"]
            }
        },
    });
    
    return safeJsonParse<Feedback>(response.text);
};

export const getCareerSuggestions = async (role: string): Promise<CareerSuggestion[]> => {
     const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Basado en las habilidades para un '${role}', sugiere 3 roles de trabajo relacionados y de alta demanda en el mercado actual. Para cada rol, proporciona una breve descripción y explica por qué es una carrera relevante y bien remunerada.`,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        role: { type: Type.STRING },
                        description: { type: Type.STRING },
                        relevance: { type: Type.STRING }
                    },
                    required: ["role", "description", "relevance"]
                }
            }
        },
    });

    const suggestions = safeJsonParse<CareerSuggestion[]>(response.text);
    return suggestions || [];
};