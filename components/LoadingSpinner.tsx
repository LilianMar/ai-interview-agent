import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      <p className="text-lg text-gray-300">{text}</p>
    </div>
  );
};

export default LoadingSpinner;