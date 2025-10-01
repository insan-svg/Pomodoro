
export type View = 'timer' | 'tasks' | 'reports' | 'settings';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  pomodoros: number; // Pomodoros completed for this task
  estimate: number; // Estimated pomodoros
}

export interface PomodoroSession {
  timestamp: number; // End time of the session
}

export interface Settings {
  pomodoro: number; // in minutes
  shortBreak: number; // in minutes
  longBreak: number; // in minutes
  longBreakInterval: number; // number of pomodoros before a long break
}

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';
