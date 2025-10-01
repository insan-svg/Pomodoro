
import React from 'react';
import type { View } from '../types';
import { TimerIcon, TasksIcon, ReportsIcon, SettingsIcon } from './icons';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-slate-700 text-white'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="p-4 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
           <TimerIcon className="w-8 h-8 text-violet-400" />
           <h1 className="text-2xl font-bold tracking-tighter">Pomodoro Times</h1>
        </div>
        <nav className="flex items-center space-x-2 bg-slate-800/50 p-1 rounded-lg">
           <NavItem
             label="Timer"
             icon={<TimerIcon className="w-5 h-5" />}
             isActive={currentView === 'timer'}
             onClick={() => setView('timer')}
           />
           <NavItem
             label="Tasks"
             icon={<TasksIcon className="w-5 h-5" />}
             isActive={currentView === 'tasks'}
             onClick={() => setView('tasks')}
           />
           <NavItem
             label="Reports"
             icon={<ReportsIcon className="w-5 h-5" />}
             isActive={currentView === 'reports'}
             onClick={() => setView('reports')}
           />
        </nav>
        <div className="flex items-center space-x-4">
             <button onClick={() => setView('settings')} className="text-slate-400 hover:text-white transition-colors">
                <SettingsIcon className="w-6 h-6"/>
             </button>
             <img src="https://picsum.photos/40" alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-slate-700" />
        </div>
      </div>
    </header>
  );
};
