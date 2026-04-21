"use client";
//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
interface Recommendation {
  skill: string;
  priority: 'High' | 'Medium' | 'Low';
  timeEstimate: string;
  reason: string;
  resources: string[];
}

export default function SkillRecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const priorityColors = {
    High: 'border-red-500 bg-red-50',
    Medium: 'border-yellow-500 bg-yellow-50',
    Low: 'border-green-500 bg-green-50',
  };

  const priorityBadgeColors = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700',
  };

  return (
    <div className={`border-l-4 rounded-lg p-4 mb-4 bg-white shadow-sm ${priorityColors[recommendation.priority]}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-[#111827]">{recommendation.skill}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityBadgeColors[recommendation.priority]}`}>
          {recommendation.priority} Priority
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">⏱️ {recommendation.timeEstimate}</p>
      <p className="text-sm text-gray-700 mb-3">{recommendation.reason}</p>
      <div className="flex flex-wrap gap-2">
        {recommendation.resources.map((resource, i) => (
          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {resource}
          </span>
        ))}
      </div>
    </div>
  );
}