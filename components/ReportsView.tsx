
import React, { useMemo } from 'react';
import type { PomodoroSession } from '../types';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ReportsViewProps {
  sessions: PomodoroSession[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-700 p-2 border border-slate-600 rounded-md shadow-lg">
          <p className="label text-slate-300">{`${label}`}</p>
          <p className="intro text-cyan-400">{`Pomodoros: ${payload[0].value}`}</p>
        </div>
      );
    }
  
    return null;
  };

export const ReportsView: React.FC<ReportsViewProps> = ({ sessions }) => {
    
    const dailyData = useMemo(() => {
        const now = new Date();
        const twentyFourHoursAgo = now.getTime() - (24 * 60 * 60 * 1000);
        
        const relevantSessions = sessions.filter(s => s.timestamp >= twentyFourHoursAgo);
        
        const hours = Array.from({ length: 24 }, (_, i) => {
            const date = new Date(now);
            date.setHours(now.getHours() - i);
            return { hour: date.getHours(), count: 0, label: `${date.getHours()}:00` };
        }).reverse();
        
        relevantSessions.forEach(session => {
            const hour = new Date(session.timestamp).getHours();
            const hourBin = hours.find(h => h.hour === hour);
            if(hourBin) {
                hourBin.count++;
            }
        });

        return hours.map(h => ({ name: h.label, pomodoros: h.count }));
    }, [sessions]);

    const weeklyData = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklySummary = days.map(day => ({ name: day, pomodoros: 0 }));

        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfWeek.setHours(0,0,0,0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        
        const relevantSessions = sessions.filter(s => s.timestamp >= startOfWeek.getTime() && s.timestamp < endOfWeek.getTime());
        
        relevantSessions.forEach(session => {
            const dayIndex = new Date(session.timestamp).getDay();
            weeklySummary[dayIndex].pomodoros++;
        });

        return weeklySummary;
    }, [sessions]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold mb-1">Reports</h1>
        <p className="text-slate-400 mb-8">Analyze your performance metrics and optimize your workflow.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                <h2 className="text-xl font-bold mb-1">Daily Focus Sessions</h2>
                <p className="text-slate-400 mb-6">Pomodoros completed over the last 24 hours</p>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="pomodoros" stroke="#22d3ee" fillOpacity={1} fill="url(#colorUv)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                <h2 className="text-xl font-bold mb-1">Weekly Summary</h2>
                <p className="text-slate-400 mb-6">Total Pomodoros per day</p>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#c084fc" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="pomodoros" fill="url(#colorBar)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </div>
  );
};
