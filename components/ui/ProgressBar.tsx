"use client";

import { useState } from "react";

interface ProgressBarProps {
  skill: string;
  progress: number;
  onUpdate: (skill: string, progress: number) => void;
  priority: string;
  why: string;
  timeEstimate: string;
  resources: string[];
}

export default function ProgressBar({ 
  skill, 
  progress, 
  onUpdate, 
  priority, 
  why, 
  timeEstimate,
  resources 
}: ProgressBarProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch(priority.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  return (
    <div className="border-b pb-3 last:border-0">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{skill}</span>
          <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(priority)}`}>
            {priority} Priority
          </span>
        </div>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-purple-600 hover:text-purple-700"
        >
          {showDetails ? "Hide details ↑" : "Why learn this? ↓"}
        </button>
        
        {progress < 100 && (
          <button
            onClick={() => onUpdate(skill, Math.min(progress + 10, 100))}
            className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
          >
            +10%
          </button>
        )}
        
        {progress === 100 && (
          <span className="text-xs text-green-600">✓ Completed!</span>
        )}
      </div>
      
      {showDetails && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
          <p className="mb-2"><strong>Why:</strong> {why}</p>
          <p className="mb-2"><strong>Time estimate:</strong> {timeEstimate}</p>
          <p><strong>Resources:</strong></p>
          <ul className="list-disc list-inside mt-1">
            {resources.map(resource => (
              <li key={resource} className="text-gray-600">{resource}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}