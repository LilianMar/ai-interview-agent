export enum Screen {
  WELCOME,
  ROLE_SELECTION,
  TOPIC_SELECTION,
  GUIDED_REVIEW,
  INTERVIEW,
  RESULTS,
  CAREER_SUGGESTIONS,
}

export interface Explanation {
  definition: string;
  details: string;
  keyConcepts: string[];
  useCases: string[];
  codeExample?: string;
  resources: string[];
}

export interface Topic {
  title: string;
  explanation: Explanation;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  userAnswerIndex?: number;
}

export interface Feedback {
  strengths: string;
  areasToImprove: string;
  suggestedResources: string[];
}

export interface InterviewResult {
  score: number;
  questions: Question[];
  feedback: Feedback;
}

export interface AppState {
  screen: Screen;
  role?: string;
  topics?: Topic[];
  questionCount?: number;
  interviewResult?: InterviewResult;
}

export interface CareerSuggestion {
    role: string;
    description: string;
    relevance: string;
}

export interface GoogleSheetRow {
    timestamp: string;
    userName: string;
    email: string;
    role: string;
    topics: string;
    score: number;
    result: string; // e.g., 'Aprobado' or 'No Aprobado'
    areasToReinforce: string;
}
