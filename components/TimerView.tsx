import React, { useMemo } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useAudio } from '../hooks/useAudio';
import type { Settings, Task, TimerMode, PomodoroSession } from '../types';
import { FlameIcon } from './icons';

interface TimerViewProps {
  settings: Settings;
  activeTask: Task | null;
  onSessionComplete: (taskId: string | null) => void;
  sessions: PomodoroSession[];
}

const modeDisplay: Record<TimerMode, { text: string; color: string }> = {
  pomodoro: { text: 'Focus Time!', color: 'text-green-400' },
  shortBreak: { text: 'Short Break', color: 'text-blue-400' },
  longBreak: { text: 'Long Break', color: 'text-indigo-400' },
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const TimerView: React.FC<TimerViewProps> = ({ settings, activeTask, onSessionComplete, sessions }) => {
  const playSound = useAudio();

  const handleSessionComplete = () => {
    playSound();
    onSessionComplete(activeTask?.id ?? null);
  };
  
  const handleBreakComplete = () => {
    playSound();
  }

  const { secondsLeft, isActive, mode, startPause, skip } = useTimer({
    settings,
    onSessionComplete: handleSessionComplete,
    onBreakComplete: handleBreakComplete,
  });

  const totalSeconds =
    mode === 'pomodoro'
      ? settings.pomodoro * 60
      : mode === 'shortBreak'
      ? settings.shortBreak * 60
      : settings.longBreak * 60;
  
  const progress = (totalSeconds - secondsLeft) / totalSeconds;
  
  const radius = 150;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const DAILY_GOAL = 8; // Or from settings in the future
  const dailyPomodoros = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sessions.filter(s => s.timestamp >= today.getTime()).length;
  }, [sessions]);

  const dailyProgress = Math.min((dailyPomodoros / DAILY_GOAL) * 100, 100);
  
  // For now, streak is a placeholder. A real implementation would need more logic.
  const weeklyStreak = 14; 

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-16 backdrop-blur-lg border border-slate-700">
        <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-slate-100">Level Up Your Focus!</h1>
            <p className="text-cyan-400 font-medium mt-2">Current Task: {activeTask ? activeTask.text : 'None'}</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 xl:gap-24">
            <div className="relative w-full max-w-[18rem] sm:max-w-[20rem] aspect-square flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 320 320">
                    <circle cx="160" cy="160" r="150" stroke="rgba(255,255,255,0.1)" strokeWidth="20" fill="transparent" />
                    <circle
                        cx="160"
                        cy="160"
                        r="150"
                        stroke="url(#progressGradient)"
                        strokeWidth="20"
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-500"
                    />
                    <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#EC4899" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="z-10 text-center">
                    <div className="text-6xl sm:text-7xl font-bold tracking-tighter" style={{ fontFamily: 'monospace' }}>
                        {formatTime(secondsLeft)}
                    </div>
                    <div className={`text-lg font-semibold ${modeDisplay[mode].color}`}>{modeDisplay[mode].text}</div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-8 w-full md:w-72">
                 {/* DAILY XP GOAL */}
                <div className="w-full">
                    <p className="text-sm font-bold tracking-widest text-slate-400 uppercase text-center mb-2">Daily XP Goal</p>
                    <div className="w-full bg-slate-700/50 rounded-full h-4 border border-slate-700">
                        <div 
                            className="bg-gradient-to-r from-cyan-400 to-violet-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${dailyProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-slate-400 text-center mt-1 font-mono">{dailyPomodoros} / {DAILY_GOAL} XP</p>
                </div>

                {/* WEEKLY STREAK */}
                <div className="text-center">
                    <p className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Weekly Streak</p>
                    <div className="flex items-center justify-center gap-2">
                        <FlameIcon className="h-10 w-10 text-amber-400" />
                        <span className="text-5xl font-bold">{weeklyStreak}</span>
                        <span className="text-lg text-slate-400 self-end pb-1">Days</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-center gap-4">
            <button
                onClick={startPause}
                className="w-full md:w-auto px-12 py-4 text-xl font-bold uppercase rounded-xl bg-violet-600 hover:bg-violet-500 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-violet-600/30"
            >
                {isActive ? 'Pause Quest' : 'Start Quest'}
            </button>
             <button
                onClick={skip}
                className="w-full md:w-auto px-12 py-4 text-xl font-bold uppercase rounded-xl bg-amber-500 hover:bg-amber-400 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-amber-500/30"
            >
                Skip
            </button>
        </div>
      </div>
    </div>
  );
};
