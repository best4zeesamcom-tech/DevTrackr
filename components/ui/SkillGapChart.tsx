"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function SkillGapChart({ data }: { data: Array<{ skill: string; gap: number; priority: string }> }) {
  const getBarColor = (priority: string) => {
    switch(priority) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      default: return '#10B981';
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 70 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 100]} label={{ value: 'Skill Gap (%)', position: 'bottom' }} />
        <YAxis type="category" dataKey="skill" tick={{ fill: '#374151', fontSize: 12 }} />
        <Tooltip formatter={(value) => `${value}% gap`} />
        <Bar dataKey="gap" radius={[0, 8, 8, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.priority)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}