import React, { useState, useCallback } from 'react';
import { Screen, InterviewResult, AppState, Topic } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import TopicSelectionScreen from './components/TopicSelectionScreen';
import GuidedReviewScreen from './components/GuidedReviewScreen';
import InterviewScreen from './components/InterviewScreen';
import ResultsScreen from './components/ResultsScreen';
import CareerSuggestionsScreen from './components/CareerSuggestions';
import { BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({ screen: Screen.WELCOME });

  const resetApp = useCallback(() => {
    setAppState({ screen: Screen.WELCOME });
  }, []);

  const renderScreen = () => {
    switch (appState.screen) {
      case Screen.WELCOME:
        return (
          <WelcomeScreen
            onStart={() => setAppState({ screen: Screen.ROLE_SELECTION })}
          />
        );
      case Screen.ROLE_SELECTION:
        return (
          <RoleSelectionScreen
            onRoleSelect={(role) =>
              setAppState({ screen: Screen.TOPIC_SELECTION, role })
            }
          />
        );
      case Screen.TOPIC_SELECTION:
        return (
          <TopicSelectionScreen
            role={appState.role!}
            onTopicsSelect={(topics) =>
              setAppState({ ...appState, screen: Screen.GUIDED_REVIEW, topics })
            }
          />
        );
      case Screen.GUIDED_REVIEW:
        return (
          <GuidedReviewScreen
            role={appState.role!}
            topics={appState.topics!}
            onStartInterview={(questionCount) =>
              setAppState({ ...appState, screen: Screen.INTERVIEW, questionCount })
            }
          />
        );
      case Screen.INTERVIEW:
        return (
          <InterviewScreen
            role={appState.role!}
            topics={appState.topics!}
            questionCount={appState.questionCount!}
            onInterviewComplete={(interviewResult) =>
              setAppState({ ...appState, screen: Screen.RESULTS, interviewResult })
            }
          />
        );
      case Screen.RESULTS:
        return (
          <ResultsScreen
            interviewResult={appState.interviewResult!}
            role={appState.role!}
            topics={appState.topics!}
            onComplete={() =>
              setAppState({ ...appState, screen: Screen.CAREER_SUGGESTIONS })
            }
          />
        );
       case Screen.CAREER_SUGGESTIONS:
        return (
          <CareerSuggestionsScreen
            role={appState.role!}
            onRestart={resetApp}
          />
        );
      default:
        return (
          <WelcomeScreen
            onStart={() => setAppState({ screen: Screen.ROLE_SELECTION })}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans flex flex-col items-center p-4">
      <header className="w-full max-w-4xl mx-auto py-4 flex items-center justify-center space-x-3 text-white">
        <BrainCircuit className="h-8 w-8 text-cyan-400" />
        <h1 className="text-3xl font-bold tracking-tight">PrepAI</h1>
      </header>
      <main className="flex-grow flex items-center justify-center w-full">
        <div className="w-full max-w-4xl p-2">
            {renderScreen()}
        </div>
      </main>
      <footer className="text-gray-500 text-sm p-4 text-center">
        © {new Date().getFullYear()} PrepAI. All rights reserved.
      </footer>
    </div>
  );
};

export default App;