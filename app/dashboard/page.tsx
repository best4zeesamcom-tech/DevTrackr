"use client";

import { useEffect, useState } from "react";
import ProgressBar from "@/components/ui/ProgressBar";
import SkillRadarChart from "@/components/ui/SkillRadarChart";
import SkillGapChart from "@/components/ui/SkillGapChart";
import SkillRecommendationCard from "@/components/ui/SkillRecommendationCard";

interface AnalysisData {
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
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const stored = localStorage.getItem("devtrackr_analysis");
    if (stored) {
      const parsed = JSON.parse(stored);
      setData(parsed);
      
      const initialProgress: Record<string, number> = {};
      parsed.missingSkills?.forEach((skill: string) => {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="bg-gray-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📄</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Analysis Found</h2>
          <p className="text-gray-500 mb-6">Upload your resume to get started</p>
          <a href="/" className="inline-block w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition">
            Upload Resume →
          </a>
        </div>
      </div>
    );
  }

  const radarData = data.missingSkills?.slice(0, 6).map(skill => ({
    skill: skill,
    current: 0,
    required: 85,
  })) || [];

  const gapData = data.learningRoadmap?.map(item => ({
    skill: item.skill,
    gap: item.priority === "High" ? 85 : item.priority === "Medium" ? 60 : 40,
    priority: item.priority,
  })) || [];

  const totalProgress = Object.values(progress).reduce((a, b) => a + b, 0);
  const averageProgress = data.missingSkills?.length > 0 ? totalProgress / data.missingSkills.length : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Track your learning progress and career growth</p>
            </div>
          </div>
        </div>

        {/* Stats Grid - Clean Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current Skills</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{data.currentSkills?.length || 0}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Skills to Learn</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{data.missingSkills?.length || 0}</p>
              </div>
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overall Progress</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{Math.round(averageProgress)}%</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Job Matches</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{data.recommendedRoles?.length || 0}</p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <span className="text-xl">💼</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-6">
            {[
              { id: "overview", label: "Overview" },
              { id: "skills", label: "Skills Analysis" },
              { id: "roadmap", label: "Learning Roadmap" },
              { id: "insights", label: "Insights" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <>
              {/* Progress Bar Card */}
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-900">Learning Progress</h3>
                  <span className="text-sm text-gray-500">{Math.round(averageProgress)}% Complete</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${averageProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">Keep going! You're making progress.</p>
              </div>

              {/* Two Column Layout */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Skill Radar */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-4">Skill Gap Analysis</h3>
                  <SkillRadarChart data={radarData} />
                  <p className="text-center text-xs text-gray-400 mt-3">Your skills vs market demand</p>
                </div>

                {/* Skill Gap Chart */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-4">Priority Skills</h3>
                  <SkillGapChart data={gapData} />
                </div>
              </div>

              {/* Current Skills */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-medium text-gray-900 mb-3">Your Current Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {data.currentSkills?.map(skill => (
                    <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* SKILLS ANALYSIS TAB */}
          {activeTab === "skills" && (
            <>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <span>✅</span> Your Current Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.currentSkills?.map(skill => (
                      <span key={skill} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <span>📋</span> Skills You Need
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.missingSkills?.map(skill => (
                      <span key={skill} className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-medium text-gray-900 mb-4">📊 Skill Gap Analysis</h3>
                <SkillGapChart data={gapData} />
              </div>
            </>
          )}

          {/* LEARNING ROADMAP TAB */}
{activeTab === "roadmap" && (
  <>
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <h3 className="font-medium text-gray-900 mb-4">📚 Your Learning Roadmap</h3>
      <div className="space-y-4">
        {data.learningRoadmap?.map(item => (
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

    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <h3 className="font-medium text-gray-900 mb-4">🎓 Recommended Learning Path</h3>
      <div className="space-y-3">
        {data.learningRoadmap?.map((item, idx) => (
          <SkillRecommendationCard 
            key={idx} 
            recommendation={{
              skill: item.skill,
              priority: item.priority as 'High' | 'Medium' | 'Low',
              why: item.why,
              timeEstimate: item.timeEstimate,
              resources: item.resources
            }} 
          />
        ))}
      </div>
    </div>
  </>
)}
          {/* INSIGHTS TAB */}
          {activeTab === "insights" && (
            <>
              {data.resumeText && (
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <span>📄</span> Resume Analysis
                  </h3>
                  <div className="max-h-48 overflow-y-auto text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {data.resumeText}
                  </div>
                </div>
              )}

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <span>🎯</span> Interview Topics
                  </h3>
                  <ul className="space-y-2">
                    {data.interviewTopics?.map(topic => (
                      <li key={topic} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-gray-400">→</span> {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <span>🛠️</span> Portfolio Projects
                  </h3>
                  <div className="space-y-3">
                    {data.portfolioProjects?.map(project => (
                      <div key={project.name} className="border border-gray-100 rounded-lg p-3">
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.techStack?.map(tech => (
                            <span key={tech} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <span>💼</span> Recommended Roles
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {data.recommendedRoles?.map(role => (
                    <span key={role} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                      {role}
                    </span>
                  ))}
                </div>
                <button className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition">
                  Browse Jobs →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}