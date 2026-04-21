"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface SkillData {
  skill: string;
  current: number;
  required: number;
}

export default function SkillRadarChart({ data }: { data: SkillData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="skill" tick={{ fill: '#6B7280', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6B7280' }} />
        <Radar
          name="Your Skills"
          dataKey="current"
          stroke="#3B82F6"
          fill="#3B82F6"
          fillOpacity={0.3}
        />
        <Radar
          name="Market Required"
          dataKey="required"
          stroke="#6366F1"
          fill="#6366F1"
          fillOpacity={0.3}
        />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}