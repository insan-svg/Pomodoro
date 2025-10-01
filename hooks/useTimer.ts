
import { useState, useEffect, useCallback, useRef } from 'react';
import type { Settings, TimerMode } from '../types';

interface TimerProps {
  settings: Settings;
  onSessionComplete: () => void;
  onBreakComplete: () => void;
}

export const useTimer = ({ settings, onSessionComplete, onBreakComplete }: TimerProps) => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [isActive, setIsActive] = useState(false);
  const [pomodorosInCycle, setPomodorosInCycle] = useState(0);
  
  const getDuration = useCallback((currentMode: TimerMode) => {
    switch (currentMode) {
      case 'pomodoro':
        return settings.pomodoro * 60;
      case 'shortBreak':
        return settings.shortBreak * 60;
      case 'longBreak':
        return settings.longBreak * 60;
    }
  }, [settings]);

  const [secondsLeft, setSecondsLeft] = useState(getDuration(mode));
  const intervalRef = useRef<number | null>(null);

  const switchMode = useCallback(() => {
    let nextMode: TimerMode;
    if (mode === 'pomodoro') {
        const newPomodorosInCycle = pomodorosInCycle + 1;
        setPomodorosInCycle(newPomodorosInCycle);
        if (newPomodorosInCycle % settings.longBreakInterval === 0) {
            nextMode = 'longBreak';
        } else {
            nextMode = 'shortBreak';
        }
        onSessionComplete();
    } else {
        nextMode = 'pomodoro';
        onBreakComplete();
    }
    setMode(nextMode);
    setIsActive(false);
    setSecondsLeft(getDuration(nextMode));
  }, [mode, pomodorosInCycle, settings, getDuration, onSessionComplete, onBreakComplete]);

  useEffect(() => {
    if (secondsLeft === 0) {
      switchMode();
    }
  }, [secondsLeft, switchMode]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  useEffect(() => {
    setSecondsLeft(getDuration(mode));
    setIsActive(false);
  }, [settings, getDuration, mode]);
  
  const startPause = () => {
    setIsActive(!isActive);
  };
  
  const reset = () => {
    setIsActive(false);
    setSecondsLeft(getDuration(mode));
  };
  
  const skip = () => {
      switchMode();
  };

  return { secondsLeft, isActive, mode, startPause, reset, skip, pomodorosInCycle };
};
