"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AIChatInterface from "@/components/ui/AIChatInterface";

interface AnalysisData {
  userName?: string;
  resumeText?: string;
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

  useEffect(() => {
    const stored = localStorage.getItem("devtrackr_analysis");
    if (stored) {
      const parsed = JSON.parse(stored);
      setData(parsed);
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E0E7FF] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-gradient-to-br from-[#3B82F6] to-[#6366F1] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚀</span>
          </div>
          <h2 className="text-2xl font-semibold text-[#111827] mb-2">No Analysis Found</h2>
          <p className="text-[#6B7280] mb-6">Upload your resume to get started</p>
          <a href="/" className="inline-block w-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
            Upload Resume →
          </a>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout 
      userName={data.userName}
      currentSkills={data.currentSkills}
      missingSkills={data.missingSkills}
      recommendedRoles={data.recommendedRoles}
    >
      {/* AI Chat Interface */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-[#E0E7FF] overflow-hidden">
        <AIChatInterface 
          resumeText={data.resumeText || ""}
          currentSkills={data.currentSkills}
          missingSkills={data.missingSkills}
          recommendedRoles={data.recommendedRoles}
          userName={data.userName}
        />
      </div>
    </DashboardLayout>
  );
}