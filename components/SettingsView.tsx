
import React, { useState } from 'react';
import type { Settings } from '../types';

interface SettingsViewProps {
  settings: Settings;
  onSave: (newSettings: Settings) => void;
}

const SettingInput: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
}> = ({ label, value, onChange, unit }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    <div className="flex items-center">
      <input
        type="number"
        min="1"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
      />
      <span className="ml-2 text-slate-400">{unit}</span>
    </div>
  </div>
);

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSave }) => {
  const [currentSettings, setCurrentSettings] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(currentSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  const updateSetting = <K extends keyof Settings,>(key: K, value: Settings[K]) => {
      setCurrentSettings(prev => ({...prev, [key]: value}));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-6">Settings</h1>
      
      <div className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 space-y-6">
        <h2 className="text-2xl font-bold text-violet-400 border-b-2 border-violet-400/20 pb-2 mb-6">Timer Durations</h2>
        
        <SettingInput
          label="Pomodoro"
          value={currentSettings.pomodoro}
          onChange={(val) => updateSetting('pomodoro', val)}
          unit="minutes"
        />
        
        <SettingInput
          label="Short Break"
          value={currentSettings.shortBreak}
          onChange={(val) => updateSetting('shortBreak', val)}
          unit="minutes"
        />
        
        <SettingInput
          label="Long Break"
          value={currentSettings.longBreak}
          onChange={(val) => updateSetting('longBreak', val)}
          unit="minutes"
        />
        
         <SettingInput
          label="Long Break Interval"
          value={currentSettings.longBreakInterval}
          onChange={(val) => updateSetting('longBreakInterval', val)}
          unit="pomodoros"
        />
        
        <div className="pt-4">
          <button
            onClick={handleSave}
            className="w-full px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-md font-semibold transition-colors disabled:bg-slate-600"
          >
            {saved ? 'Settings Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
