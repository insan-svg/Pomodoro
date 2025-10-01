import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { TimerView } from './components/TimerView';
import { TasksView } from './components/TasksView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import type { View, Task, PomodoroSession, Settings } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('timer');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
      longBreakInterval: 4,
    };
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('pomodoroTasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [sessions, setSessions] = useState<PomodoroSession[]>(() => {
    const savedSessions = localStorage.getItem('pomodoroSessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
  });

  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pomodoroSessions', JSON.stringify(sessions));
  }, [sessions]);
  
  const handleSessionComplete = useCallback((taskId: string | null) => {
    const newSession: PomodoroSession = { timestamp: new Date().getTime() };
    setSessions(prev => [...prev, newSession]);
    
    if (taskId) {
        setTasks(prevTasks => prevTasks.map(task => 
            task.id === taskId ? { ...task, pomodoros: task.pomodoros + 1 } : task
        ));
    }
  }, []);

  const activeTask = useMemo(() => tasks.find(task => task.id === activeTaskId) || null, [tasks, activeTaskId]);

  const renderView = () => {
    switch (view) {
      case 'timer':
        return <TimerView sessions={sessions} settings={settings} activeTask={activeTask} onSessionComplete={handleSessionComplete}/>;
      case 'tasks':
        return <TasksView tasks={tasks} setTasks={setTasks} activeTaskId={activeTaskId} setActiveTaskId={setActiveTaskId} />;
      case 'reports':
        return <ReportsView sessions={sessions} />;
      case 'settings':
        return <SettingsView settings={settings} onSave={setSettings}/>;
      default:
        return <TimerView sessions={sessions} settings={settings} activeTask={activeTask} onSessionComplete={handleSessionComplete}/>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-cyan-300 selection:text-cyan-900">
      <Header currentView={view} setView={setView} />
      <main>
        {renderView()}
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        © 2023 Pomodoro Times. All rights reserved. Keep grinding!
      </footer>
    </div>
  );
};

export default App;
