"use client";

import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName?: string;
  currentSkills: string[];
  missingSkills: string[];
  recommendedRoles: string[];
}

export default function DashboardLayout({ 
  children, 
  userName, 
  currentSkills, 
  missingSkills, 
  recommendedRoles 
}: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState("chat");

  const menuItems = [
    { id: "chat", label: "AI Assistant", icon: "💬" },
    { id: "skills", label: "Your Skills", icon: "📊" },
    { id: "test", label: "Skill Assessment", icon: "📝" },
    { id: "weak", label: "Weak Points", icon: "⚠️" },
    { id: "jobs", label: "Job Matches", icon: "💼" },
  ];

  const skillsProgress = Math.min((currentSkills.length / 15) * 100, 100);
  const learningProgress = Math.min((missingSkills.length / 10) * 100, 100);

  return (
    <div className="flex min-h-screen bg-[#FFF7ED]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 shadow-lg fixed h-full overflow-y-auto">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-[#F97316] p-2 rounded-lg text-white">
              <span className="text-xl">{'<'}/&gt;</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">DevTrackr</h1>
          </div>

          {/* User Info */}
          <div className="mb-8 p-4 bg-[#FDBA74] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#F97316] rounded-full flex items-center justify-center">
                <span className="text-white text-lg">👤</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{userName || "Developer"}</p>
                <p className="text-xs text-gray-500">{recommendedRoles[0] || "Software Engineer"}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-[#F97316] text-white shadow-md"
                    : "text-gray-500 hover:bg-[#FFF7ED] hover:text-[#EA580C]"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Stats Summary */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-3">Your Progress</p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Skills Learned</span>
                  <span className="font-medium text-gray-900">{currentSkills.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${skillsProgress}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Learning Path</span>
                  <span className="font-medium text-gray-900">{missingSkills.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-[#F97316] h-1.5 rounded-full" style={{ width: `${learningProgress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 overflow-auto">
        <div className="p-8">
          {activeTab === "chat" && children}
          {activeTab === "skills" && <SkillsPanel currentSkills={currentSkills} missingSkills={missingSkills} />}
          {activeTab === "test" && <SkillTestPanel currentSkills={currentSkills} missingSkills={missingSkills} />}
          {activeTab === "weak" && <WeakPointsPanel currentSkills={currentSkills} missingSkills={missingSkills} />}
          {activeTab === "jobs" && <JobMatchesPanel currentSkills={currentSkills} userName={userName} />}
        </div>
      </main>
    </div>
  );
}

// Skills Panel Component
function SkillsPanel({ currentSkills, missingSkills }: { currentSkills: string[], missingSkills: string[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Your Skills</h2>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center gap-2">
          <span>✅</span> Skills You Have
        </h3>
        <div className="flex flex-wrap gap-2">
          {currentSkills.map((skill, i) => (
            <span key={i} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium">
              {skill}
            </span>
          ))}
          {currentSkills.length === 0 && (
            <p className="text-gray-500 text-sm">No skills detected yet. Upload your resume.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-orange-600 mb-4 flex items-center gap-2">
          <span>📚</span> Skills to Learn
        </h3>
        <div className="flex flex-wrap gap-2">
          {missingSkills.map((skill, i) => (
            <span key={i} className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-sm font-medium">
              {skill}
            </span>
          ))}
          {missingSkills.length === 0 && (
            <p className="text-gray-500 text-sm">Great job! No missing skills identified.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Skill Test Panel
function SkillTestPanel({ currentSkills, missingSkills }: { currentSkills: string[], missingSkills: string[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const testQuestions: Record<string, { question: string, options: string[], correct: string }> = {
    "JavaScript": {
      question: "What is a closure in JavaScript?",
      options: ["A function with access to its outer scope", "A way to close a browser", "A type of loop", "A CSS property"],
      correct: "A function with access to its outer scope"
    },
    "React": {
      question: "What is the purpose of useState?",
      options: ["API calls", "State management", "Styling", "Routing"],
      correct: "State management"
    },
    "Node.js": {
      question: "What is Node.js primarily used for?",
      options: ["Frontend", "Server-side JavaScript", "Database", "CSS"],
      correct: "Server-side JavaScript"
    },
    "Python": {
      question: "What is Python used for?",
      options: ["Web development", "Data science", "AI/ML", "All of the above"],
      correct: "All of the above"
    },
  };

  const handleAnswer = (skill: string, answer: string) => {
    setAnswers({ ...answers, [skill]: answer });
  };

  const getSkillLevel = (skill: string): string => {
    if (!answers[skill]) return "Not tested";
    return answers[skill] === testQuestions[skill]?.correct ? "✅ Proficient" : "❌ Needs work";
  };

  const allSkills = [...new Set([...currentSkills, ...missingSkills])].slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Skill Assessment</h2>
        <p className="text-gray-500 mt-1">Take tests to evaluate your skill level</p>
      </div>

      <div className="space-y-4">
        {allSkills.map((skill) => (
          testQuestions[skill] && (
            <div key={skill} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{skill}</h3>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  getSkillLevel(skill) === "✅ Proficient" ? "bg-green-100 text-green-700" :
                  getSkillLevel(skill) === "❌ Needs work" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-500"
                }`}>
                  {getSkillLevel(skill)}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{testQuestions[skill].question}</p>
              <div className="space-y-2">
                {testQuestions[skill].options.map((option, i) => (
                  <label key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name={skill}
                      value={option}
                      onChange={(e) => handleAnswer(skill, e.target.value)}
                      className="w-4 h-4 text-[#F97316]"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )
        ))}
        {allSkills.filter(s => testQuestions[s]).length === 0 && (
          <div className="bg-white rounded-2xl p-6 text-center">
            <p className="text-gray-500">No test questions available for your skills yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Weak Points Panel
function WeakPointsPanel({ currentSkills, missingSkills }: { currentSkills: string[], missingSkills: string[] }) {
  const weakPoints = [
    ...missingSkills.slice(0, 3).map(skill => ({
      skill: skill,
      reason: "Missing from your resume. Essential for modern development.",
      priority: "High"
    })),
    ...currentSkills.slice(0, 2).map(skill => ({
      skill: skill,
      reason: "Consider deepening your knowledge with advanced concepts.",
      priority: "Medium"
    }))
  ];

  if (weakPoints.length === 0) {
    weakPoints.push({
      skill: "Portfolio Projects",
      reason: "Build real-world projects to showcase your skills",
      priority: "High"
    });
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Weak Points & Improvement Areas</h2>
        <p className="text-gray-500 mt-1">Focus on these areas to level up your skills</p>
      </div>

      <div className="space-y-4">
        {weakPoints.map((point, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{point.skill}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                point.priority === "High" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {point.priority} Priority
              </span>
            </div>
            <p className="text-gray-600 mb-3">{point.reason}</p>
            <button className="text-sm text-[#F97316] hover:text-[#EA580C] font-medium transition">
              📚 View Learning Resources →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Job Matches Panel
function JobMatchesPanel({ currentSkills, userName }: { currentSkills: string[], userName?: string }) {
  const [loading, setLoading] = useState(false);

  const companies = [
    { name: "Tech Solutions Inc.", role: "MERN Stack Developer", location: "Remote", matchScore: 85, salary: "$80k - $120k" },
    { name: "Digital Innovations", role: "React Native Developer", location: "Islamabad", matchScore: 78, salary: "PKR 150k - 250k" },
    { name: "Cloud Systems", role: "Node.js Backend", location: "Lahore", matchScore: 72, salary: "PKR 120k - 200k" },
    { name: "Creative Agency", role: "Frontend Developer", location: "Karachi", matchScore: 68, salary: "PKR 100k - 180k" },
    { name: "AI Solutions", role: "Full Stack Developer", location: "Remote", matchScore: 65, salary: "$70k - $100k" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Companies Hiring</h2>
          <p className="text-gray-500 mt-1">Based on your {currentSkills[0] || "developer"} skills</p>
        </div>
        <button
          onClick={() => setLoading(!loading)}
          className="px-4 py-2 bg-[#F97316] text-white rounded-lg font-medium hover:bg-[#EA580C] transition flex items-center gap-2"
        >
          🔍 Refresh Jobs
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316] mx-auto mb-4"></div>
          <p className="text-gray-500">Finding jobs for you...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {companies.map((company, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{company.role}</h3>
                  <p className="text-gray-500 text-sm">{company.name} • {company.location}</p>
                </div>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  company.matchScore >= 80 ? "bg-green-100 text-green-700" :
                  company.matchScore >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {company.matchScore}% Match
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">💰 {company.salary}</p>
              <div className="flex gap-3">
                <button className="text-sm bg-[#F97316] text-white px-4 py-2 rounded-lg hover:bg-[#EA580C] transition">
                  Apply Now →
                </button>
                <button className="text-sm border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}