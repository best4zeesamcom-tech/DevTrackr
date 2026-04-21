"use client";

interface TimelineItem {
  week: number;
  skill: string;
  milestone: string;
  completed: boolean;
}

export default function LearningTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      {items.map((item, index) => (
        <div key={index} className="relative flex gap-4 mb-6 ml-4">
          <div className={`absolute -left-8 top-1 w-4 h-4 rounded-full border-2 ${
            item.completed ? 'bg-green-500 border-green-500' : 'bg-white border-[#3B82F6]'
          }`}></div>
          <div className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-[#111827]">Week {item.week}</span>
              {item.completed ? (
                <span className="text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full">✓ Completed</span>
              ) : (
                <span className="text-[#3B82F6] text-xs bg-blue-50 px-2 py-0.5 rounded-full">In Progress</span>
              )}
            </div>
            <h3 className="font-bold text-lg">{item.skill}</h3>
            <p className="text-sm text-gray-600">{item.milestone}</p>
          </div>
        </div>
      ))}
    </div>
  );
}