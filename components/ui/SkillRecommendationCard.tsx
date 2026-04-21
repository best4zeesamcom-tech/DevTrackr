"use client";

interface Recommendation {
  skill: string;
  priority: 'High' | 'Medium' | 'Low';
  why?: string;
  reason?: string;
  timeEstimate: string;
  resources: string[];
}

export default function SkillRecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const explanation = recommendation.why || recommendation.reason || "This skill will advance your career";
  
  return (
    <div className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition bg-white">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900">{recommendation.skill}</h4>
        <span className={`text-xs px-2 py-1 rounded-full ${
          recommendation.priority === 'High' ? 'bg-red-100 text-red-700' :
          recommendation.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-green-100 text-green-700'
        }`}>
          {recommendation.priority} Priority
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">⏱️ {recommendation.timeEstimate}</p>
      <p className="text-sm text-gray-700 mb-3">{explanation}</p>
      <div className="flex flex-wrap gap-2">
        {recommendation.resources?.map((resource, i) => (
          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {resource}
          </span>
        ))}
      </div>
    </div>
  );
}