"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function ResumeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.type === "text/plain")) {
      setFile(droppedFile);
      setUploadProgress(0);
    }
  }, []);

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    return interval;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const progressInterval = simulateProgress();

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      const resumeText = result.text || "";
      
      const aiResponse = await fetch("/api/analyze-with-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      
      const analysis = await aiResponse.json();
      
      const analysisData = {
        resumeText: resumeText,
        currentSkills: analysis.currentSkills,
        missingSkills: analysis.missingSkills,
        learningRoadmap: analysis.learningRoadmap,
        portfolioProjects: analysis.portfolioProjects,
        interviewTopics: analysis.interviewTopics,
        recommendedRoles: analysis.recommendedRoles,
        userName: analysis.userName, 
      };
      
      localStorage.setItem("devtrackr_analysis", JSON.stringify(analysisData));
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
      
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-[#F97316] p-2 rounded-lg text-white">
              {"</>"}
            </div>
            <h1 className="text-xl font-semibold text-gray-900">DevTrackr</h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Upload Your Resume</h2>
          <p className="text-gray-500 mt-2">Get personalized skill recommendations. Start your developer journey.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className={`relative border-2 border-dashed rounded-xl p-6 transition ${
              dragActive
                ? "border-[#F97316] bg-[#FDBA74]"
                : "border-gray-300 bg-[#FFF7ED]"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setUploadProgress(0);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center gap-4">
              <div className="bg-[#F97316] p-3 rounded-lg text-white text-lg">
                {"</>"}
              </div>
              <div>
                <p className="font-semibold text-gray-900">Upload Your Resume</p>
                <p className="text-sm text-gray-500">Drag & drop or <span className="text-[#F97316]">click to browse</span></p>
                <p className="text-xs text-gray-500 mt-1">PDF, TXT (Max 5MB)</p>
              </div>
            </div>
            {file && (
              <div className="mt-4 text-sm text-green-600 flex items-center gap-2">
                ✔ {file.name}
              </div>
            )}
          </div>

          {loading && (
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#F97316] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-center text-xs text-gray-500 mt-2">
                {uploadProgress < 30 && "📄 Reading resume..."}
                {uploadProgress >= 30 && uploadProgress < 70 && "🤖 Analyzing..."}
                {uploadProgress >= 70 && "✨ Generating roadmap..."}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className={`w-full mt-6 py-3 rounded-lg font-semibold text-white transition ${
              !file || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#F97316] hover:bg-[#EA580C]"
            }`}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>

          <div className="mt-6 text-sm text-gray-500 space-y-2 text-center">
            <p>✔ AI-powered resume analysis</p>
            <p>✔ Personalized skill roadmap</p>
            <p>✔ Get ready for tech jobs</p>
          </div>
        </form>
      </div>
    </div>
  );
}