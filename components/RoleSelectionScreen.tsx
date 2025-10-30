import React, { useState } from 'react';
import { PREDEFINED_ROLES } from '../constants';
import { ArrowRight } from 'lucide-react';

interface RoleSelectionScreenProps {
  onRoleSelect: (role: string) => void;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onRoleSelect }) => {
  const [customRole, setCustomRole] = useState('');

  const handleCustomRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customRole.trim()) {
      onRoleSelect(customRole.trim());
    }
  };

  return (
    <div className="animate-fade-in-up">
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-center mb-2 text-cyan-400">Paso 1: Elige tu rol</h2>
            <p className="text-center text-gray-400 mb-8">Selecciona un rol o escribe el tuyo para personalizar tu preparación.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {PREDEFINED_ROLES.map((role) => (
                <button
                key={role}
                onClick={() => onRoleSelect(role)}
                className="text-left p-4 bg-gray-700/50 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-400 border-2 border-gray-700 transition-all duration-200"
                >
                {role}
                </button>
            ))}
            </div>

            <form onSubmit={handleCustomRoleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="O escribe tu propio rol aquí..."
                className="flex-grow bg-gray-900 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
                type="submit"
                className="bg-cyan-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-cyan-600 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-600"
                disabled={!customRole.trim()}
            >
                <span>Continuar</span>
                <ArrowRight className="h-5 w-5" />
            </button>
            </form>
        </div>
    </div>
  );
};

export default RoleSelectionScreen;