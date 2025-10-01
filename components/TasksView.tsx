
import React, { useState } from 'react';
import type { Task } from '../types';
import { PlusIcon, CheckIcon } from './icons';

interface TasksViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
}

const TaskItem: React.FC<{
    task: Task;
    onToggle: (id: string) => void;
    onSetActive: (id:string) => void;
    isActive: boolean;
}> = ({ task, onToggle, onSetActive, isActive }) => {
    return (
        <div 
          onClick={() => onSetActive(task.id)}
          className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 ${isActive ? 'bg-cyan-500/20 border-cyan-500' : 'bg-slate-800 hover:bg-slate-700 border-transparent'} border`}>
            <div>
                <p className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                    {task.text}
                </p>
                <p className="text-sm text-slate-400">
                    {task.completed ? `Completed: ${task.pomodoros} Pomodoros` : `Estimate: ${task.estimate} Pomodoros`}
                </p>
            </div>
            <button
                onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
                className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${
                    task.completed ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600 hover:border-cyan-500'
                }`}
            >
                {task.completed && <CheckIcon className="w-4 h-4 text-white" />}
            </button>
        </div>
    );
};

export const TasksView: React.FC<TasksViewProps> = ({ tasks, setTasks, activeTaskId, setActiveTaskId }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskEstimate, setNewTaskEstimate] = useState(1);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: new Date().toISOString(),
        text: newTaskText.trim(),
        completed: false,
        pomodoros: 0,
        estimate: newTaskEstimate,
      };
      setTasks([newTask, ...tasks]);
      setNewTaskText('');
      setNewTaskEstimate(1);
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const engagedTasks = tasks.filter((task) => !task.completed);
  const terminatedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-1">Today's Tasks</h1>
      <p className="text-slate-400 mb-6">Synchronize your focus. Execute your objectives.</p>

      <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-2 mb-8">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Initiate new task protocol..."
          className="flex-grow bg-slate-800 border border-slate-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
        />
        <input
          type="number"
          min="1"
          value={newTaskEstimate}
          onChange={(e) => setNewTaskEstimate(Number(e.target.value))}
          className="w-24 bg-slate-800 border border-slate-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <PlusIcon className="w-5 h-5"/>
          <span>Execute</span>
        </button>
      </form>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4 border-b-2 border-cyan-400/20 pb-2">Engaged</h2>
          <div className="space-y-2">
            {engagedTasks.length > 0 ? (
                engagedTasks.map((task) => (
                    <TaskItem key={task.id} task={task} onToggle={handleToggleTask} onSetActive={setActiveTaskId} isActive={task.id === activeTaskId}/>
                ))
            ) : (
                <p className="text-slate-500 italic p-4 text-center">No active tasks.</p>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-slate-500 mb-4 border-b-2 border-slate-700 pb-2">Terminated</h2>
          <div className="space-y-2">
             {terminatedTasks.length > 0 ? (
                terminatedTasks.map((task) => (
                    <TaskItem key={task.id} task={task} onToggle={handleToggleTask} onSetActive={setActiveTaskId} isActive={false}/>
                ))
             ) : (
                <p className="text-slate-500 italic p-4 text-center">No completed tasks yet.</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
