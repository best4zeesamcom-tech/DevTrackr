"use client";

import { useEffect, useState } from "react";
import ProgressBar from "@/components/ui/ProgressBar";

interface AnalysisData {
  currentSkills: string[];
  missingSkills: string[];
  learningRoadmap: Array<{
    skill: string;
    priority: string;
    why: string;
    timeEstimate: string;
    resources: string[];
  }>;
  portfolioProjects: Array<{
    name: string;
    description: string;
    techStack: string[];
  }>;
  interviewTopics: string[];
  recommendedRoles: string[];
}

export default function Dashboard() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const stored = localStorage.getItem("devtrackr_analysis");
    if (stored) {
      const parsed = JSON.parse(stored);
      setData(parsed);
      
      const initialProgress: Record<string, number> = {};
      parsed.missingSkills.forEach((skill: string) => {
        initialProgress[skill] = 0;
      });
      setProgress(initialProgress);
    }
  }, []);

  const updateProgress = (skill: string, newProgress: number) => {
    setProgress(prev => ({ ...prev, [skill]: newProgress }));
    const savedProgress = localStorage.getItem("devtrackr_progress");
    const allProgress = savedProgress ? JSON.parse(savedProgress) : {};
    allProgress[skill] = newProgress;
    localStorage.setItem("devtrackr_progress", JSON.stringify(allProgress));
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E0E7FF] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-gradient-to-br from-[#3B82F6] to-[#6366F1] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📄</span>
          </div>
          <h2 className="text-2xl font-bold text-[#111827] mb-2">No Analysis Found</h2>
          <p className="text-[#6B7280] mb-6">Upload your resume to get started</p>
          <a href="/" className="inline-block w-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
            Upload Resume →
          </a>
        </div>
      </div>
    );
  }

  const totalProgress = Object.values(progress).reduce((a, b) => a + b, 0);
  const averageProgress = data.missingSkills.length > 0 ? totalProgress / data.missingSkills.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E0E7FF] py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-[#3B82F6] to-[#6366F1] p-2 rounded-lg text-white">
              {"</>"}
            </div>
            <h1 className="text-xl font-semibold text-[#111827]">DevTrackr</h1>
          </div>
          <h2 className="text-3xl font-bold text-[#111827]">Your Dashboard</h2>
          <p className="text-[#6B7280] mt-2">Track your progress and stay on course</p>
        </div>

        {/* Overall Progress Card */}
        <div className="bg-gradient-to-r from-[#3B82F6] to-[#6366F1] rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-white">Overall Progress</span>
            <span className="text-2xl font-bold text-white">{Math.round(averageProgress)}%</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${averageProgress}%` }}
            />
          </div>
          <p className="text-sm mt-2 text-white/90">Keep learning! You're making great progress.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Skills */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Skills */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#E0E7FF]">
              <h2 className="text-xl font-bold text-[#111827] mb-3 flex items-center gap-2">
                <span className="bg-gradient-to-br from-[#3B82F6] to-[#6366F1] text-white text-xs px-2 py-1 rounded-full">✓</span>
                <span>Your Current Skills</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.currentSkills.map(skill => (
                  <span key={skill} className="bg-gradient-to-r from-blue-50 to-indigo-50 text-[#3B82F6] px-3 py-1 rounded-full text-sm font-medium border border-[#CBD5F5]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Learning Progress */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#E0E7FF]">
              <h2 className="text-xl font-bold text-[#111827] mb-4 flex items-center gap-2">
                <span className="text-xl">📚</span>
                <span>Skills to Learn</span>
              </h2>
              <div className="space-y-4">
                {data.learningRoadmap.map(item => (
                  <ProgressBar
                    key={item.skill}
                    skill={item.skill}
                    progress={progress[item.skill] || 0}
                    onUpdate={updateProgress}
                    priority={item.priority}
                    why={item.why}
                    timeEstimate={item.timeEstimate}
                    resources={item.resources}
                  />
                ))}
              </div>
            </div>

            {/* Portfolio Projects */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#E0E7FF]">
              <h2 className="text-xl font-bold text-[#111827] mb-4 flex items-center gap-2">
                <span className="text-xl">🛠️</span>
                <span>Portfolio Projects</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.portfolioProjects.map(project => (
                  <div key={project.name} className="border border-[#E0E7FF] rounded-xl p-4 hover:shadow-lg transition bg-white">
                    <h3 className="font-bold text-[#111827] text-lg mb-1">{project.name}</h3>
                    <p className="text-[#6B7280] text-sm mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.map(tech => (
                        <span key={tech} className="bg-gradient-to-r from-blue-50 to-indigo-50 text-[#3B82F6] px-2 py-0.5 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Insights */}
          <div className="space-y-6">
            {/* Interview Topics */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#E0E7FF]">
              <h2 className="text-xl font-bold text-[#111827] mb-3 flex items-center gap-2">
                <span className="bg-gradient-to-br from-[#3B82F6] to-[#6366F1] text-white text-xs px-2 py-1 rounded-full">🎯</span>
                <span>Interview Topics</span>
              </h2>
              <ul className="space-y-2">
                {data.interviewTopics.map(topic => (
                  <li key={topic} className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <span className="text-[#3B82F6]">→</span> {topic}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Roles */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#E0E7FF]">
              <h2 className="text-xl font-bold text-[#111827] mb-3 flex items-center gap-2">
                <span className="text-xl">💼</span>
                <span>You're Ready For</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.recommendedRoles.map(role => (
                  <span key={role} className="bg-gradient-to-r from-blue-50 to-indigo-50 text-[#3B82F6] px-3 py-1 rounded-full text-sm font-medium border border-[#CBD5F5]">
                    {role}
                  </span>
                ))}
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white py-2 rounded-lg font-semibold hover:shadow-lg transition">
                Find Jobs →
              </button>
            </div>

            {/* Motivation Quote */}
            <div className="bg-gradient-to-br from-[#3B82F6] to-[#6366F1] rounded-2xl p-6 shadow-lg text-white">
              <div className="text-3xl mb-2">💪</div>
              <p className="font-semibold">"The expert in anything was once a beginner."</p>
              <p className="text-sm mt-2 opacity-90">Keep going! Every skill you learn gets you closer to your dream job.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}