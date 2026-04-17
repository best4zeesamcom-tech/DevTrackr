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
console.log("API RESULT:", result);
    clearInterval(progressInterval);
    setUploadProgress(100);

    const analysisData = {
      resumeText: result.text, // 👈 ADD THIS
      currentSkills: ["JavaScript", "HTML", "CSS"],
      missingSkills: ["React", "Node.js"],
      learningRoadmap: [],
      portfolioProjects: [],
      interviewTopics: [],
      recommendedRoles: [],
    };

    localStorage.setItem("devtrackr_analysis", JSON.stringify(analysisData));

    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  } catch (err) {
    console.error(err);
  }
};

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E0E7FF] flex items-center justify-center px-4">
    <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8">

      {/* Logo / Title */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-gradient-to-br from-[#3B82F6] to-[#6366F1] p-2 rounded-lg text-white">
            {"</>"}
          </div>
          <h1 className="text-xl font-semibold text-[#111827]">DevTrackr</h1>
        </div>

        <h2 className="text-3xl font-bold text-[#111827]">
          Upload Your Resume
        </h2>
        <p className="text-[#6B7280] mt-2">
          Get personalized skill recommendations. Start your developer journey.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Upload Box */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 transition ${
            dragActive
              ? "border-[#3B82F6] bg-blue-50"
              : "border-[#CBD5F5] bg-[#F8FAFC]"
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

          {/* Inner Content */}
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#3B82F6] to-[#6366F1] p-3 rounded-lg text-white text-lg">
              {"</>"}
            </div>

            <div>
              <p className="font-semibold text-[#111827]">
                Upload Your Resume
              </p>
              <p className="text-sm text-[#6B7280]">
                Drag & drop or <span className="text-[#3B82F6]">click to browse</span>
              </p>
              <p className="text-xs text-[#6B7280] mt-1">
                PDF, TXT (Max 5MB)
              </p>
            </div>
          </div>

          {/* File Preview */}
          {file && (
            <div className="mt-4 text-sm text-green-600 flex items-center gap-2">
              ✔ {file.name}
            </div>
          )}
        </div>

        {/* Progress */}
        {loading && (
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#3B82F6] to-[#6366F1] h-2 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-center text-xs text-[#6B7280] mt-2">
              {uploadProgress < 30 && "📄 Reading resume..."}
              {uploadProgress >= 30 && uploadProgress < 70 && "🤖 Analyzing..."}
              {uploadProgress >= 70 && "✨ Generating roadmap..."}
            </p>
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={!file || loading}
          className={`w-full mt-6 py-3 rounded-lg font-semibold text-white transition ${
            !file || loading
              ? "bg-gray-300"
              : "bg-gradient-to-r from-[#3B82F6] to-[#6366F1] hover:shadow-lg"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {/* Features */}
        <div className="mt-6 text-sm text-[#6B7280] space-y-2">
          <p>✔ AI-powered resume analysis</p>
          <p>✔ Personalized skill roadmap</p>
          <p>✔ Get ready for tech jobs</p>
        </div>
      </form>
    </div>
  </div>
);
}