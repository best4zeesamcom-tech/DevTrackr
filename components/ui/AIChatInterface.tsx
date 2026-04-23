"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

interface AIChatInterfaceProps {
  resumeText: string;
  currentSkills: string[];
  missingSkills: string[];
  recommendedRoles: string[];
  userName?: string;
}

export default function AIChatInterface({ 
  resumeText, 
  currentSkills, 
  missingSkills, 
  recommendedRoles,
  userName
}: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showJobs, setShowJobs] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobLoading, setJobLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const displayName = userName || "there";

  useEffect(() => {
    const greeting = `👋 **Hey ${displayName}! I'm your AI Career Advisor.**

I've analyzed your resume and here's what I found:

✅ **Skills you have:** ${currentSkills.slice(0, 5).join(", ") || "Analyzing your resume..."}

🎯 **Skills to prioritize:** ${missingSkills.slice(0, 3).join(", ") || "Based on market trends"}

💼 **You're ready for:** ${recommendedRoles.slice(0, 2).join(" or ") || "Developer roles"}

---

**What would you like to know?**
• "What is my name?"
• "What skills do I have?"
• "What should I learn next?"
• "Which companies are hiring?"

Just type your question below! 👇`;
    
    setMessages([{ id: 1, role: "assistant", content: greeting }]);
  }, [displayName, currentSkills, missingSkills, recommendedRoles]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessageToAI = async (userMessage: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          context: {
            userName: displayName,
            currentSkills,
            missingSkills,
            recommendedRoles,
            fullResumeText: resumeText,
          },
        }),
      });
      
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("Chat error:", error);
      return `Hey ${displayName}! I'm having trouble connecting. Please try again.`;
    }
  };

  const fetchJobs = async () => {
    setJobLoading(true);
    try {
      const response = await fetch("/api/search-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: currentSkills }),
      });
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Job fetch error:", error);
    } finally {
      setJobLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const aiReply = await sendMessageToAI(input);
    
    const assistantMessage: Message = {
      id: messages.length + 2,
      role: "assistant",
      content: aiReply,
    };
    setMessages(prev => [...prev, assistantMessage]);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Orange Header */}
      <div className="bg-[#F97316] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">DevTrackr Assistant</h3>
            <p className="text-xs text-white/70">Powered by Groq AI • Online</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-[#FFF7ED]">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              message.role === "user"
                ? "bg-[#F97316] text-white"
                : "bg-white border border-gray-200 text-gray-900 shadow-sm"
            }`}>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className={line.startsWith('•') ? 'ml-4' : ''}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Job Button */}
      {showJobs && (
        <div className="px-6 py-3 bg-[#FDBA74] border-t border-gray-200">
          <button
            onClick={() => {
              if (jobs.length === 0) fetchJobs();
              const modal = document.createElement('div');
              modal.id = 'job-modal';
              modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
              modal.innerHTML = `
                <div class="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
                  <div class="sticky top-0 bg-white border-b p-4 flex justify-between">
                    <h3 class="font-semibold">💼 Jobs Matching Your Skills</h3>
                    <button onclick="this.closest('#job-modal').remove()" class="text-gray-500 hover:text-gray-700">✕</button>
                  </div>
                  <div class="p-4">
                    ${jobLoading ? '<div class="text-center py-8">🔍 Finding jobs for you...</div>' :
                      jobs.length === 0 ? '<div class="text-center py-8">No jobs found. Try updating your skills profile.</div>' :
                      jobs.map((job: any) => `
                        <div class="border rounded-lg p-4 mb-3">
                          <h4 class="font-semibold">${job.title}</h4>
                          <p class="text-sm text-gray-600">${job.company} • ${job.location}</p>
                          <p class="text-sm text-gray-500 mt-1">${job.salary || 'Salary not specified'}</p>
                          <div class="mt-2 flex justify-between items-center">
                            <span class="text-xs px-2 py-1 rounded-full ${job.matchScore >= 70 ? 'bg-green-100 text-green-700' : job.matchScore >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}">
                              ${job.matchScore || 65}% Match
                            </span>
                            <a href="${job.url}" target="_blank" class="text-blue-600 text-sm hover:underline">View Job →</a>
                          </div>
                        </div>
                      `).join('')}
                  </div>
                </div>
              `;
              document.body.appendChild(modal);
            }}
            className="w-full bg-[#F97316] text-white py-2.5 rounded-lg font-medium hover:bg-[#EA580C] transition flex items-center justify-center gap-2"
          >
            🔍 Find Jobs Matching Your Skills
          </button>
        </div>
      )}

      {/* Chat Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={`Ask me anything about your career, ${displayName}...`}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F97316]"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-[#F97316] text-white rounded-xl hover:bg-[#EA580C] disabled:opacity-50 transition font-medium"
          >
            Send
          </button>
        </div>
        <div className="mt-3 flex gap-2 flex-wrap">
          <button onClick={() => setInput("What is my name?")} className="text-xs px-3 py-1.5 bg-[#FFF7ED] text-gray-600 rounded-full hover:bg-[#FDBA74] hover:text-[#EA580C] transition">
            📝 What's my name?
          </button>
          <button onClick={() => setInput("What skills do I have?")} className="text-xs px-3 py-1.5 bg-[#FFF7ED] text-gray-600 rounded-full hover:bg-[#FDBA74] hover:text-[#EA580C] transition">
            ✅ My skills
          </button>
          <button onClick={() => setInput("What should I learn next?")} className="text-xs px-3 py-1.5 bg-[#FFF7ED] text-gray-600 rounded-full hover:bg-[#FDBA74] hover:text-[#EA580C] transition">
            📚 What to learn?
          </button>
          <button onClick={() => setInput("Which companies are hiring for my skills?")} className="text-xs px-3 py-1.5 bg-[#FFF7ED] text-gray-600 rounded-full hover:bg-[#FDBA74] hover:text-[#EA580C] transition">
            💼 Find jobs
          </button>
        </div>
      </div>
    </div>
  );
}