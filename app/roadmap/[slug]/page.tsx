// app/roadmap/[slug]/page.tsx

interface RoadmapData {
  title: string;
  description: string;
  skills: string[];
  projects: string[];
  resources: string[];
}

const roadmapData: Record<string, RoadmapData> = {
  frontend: {
    title: "Frontend Developer Roadmap",
    description: "Complete guide to becoming a frontend developer",
    skills: ["HTML/CSS", "JavaScript", "React", "TypeScript", "Next.js", "Tailwind CSS"],
    projects: ["Portfolio Website", "E-commerce Store", "Dashboard App", "Task Manager"],
    resources: ["Frontend Masters", "MDN Web Docs", "JavaScript.info", "React Docs"],
  },
  backend: {
    title: "Backend Developer Roadmap",
    description: "Complete guide to becoming a backend developer",
    skills: ["Node.js", "Python", "SQL", "MongoDB", "REST APIs", "Docker"],
    projects: ["Authentication API", "Task Manager API", "Chat Application", "Blog Platform"],
    resources: ["Node.js Docs", "Express.js", "MongoDB University", "Docker Docs"],
  },
  fullstack: {
    title: "Full Stack Developer Roadmap",
    description: "Complete guide to becoming a full stack developer",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Prisma", "Next.js"],
    projects: ["Social Media App", "E-commerce Platform", "Project Management Tool", "Real-time Chat"],
    resources: ["The Odin Project", "Full Stack Open", "Frontend Masters", "YouTube"],
  },
  devops: {
    title: "DevOps Engineer Roadmap",
    description: "Complete guide to becoming a DevOps engineer",
    skills: ["Linux", "Docker", "Kubernetes", "AWS/Azure", "CI/CD", "Terraform"],
    projects: ["Dockerized App", "K8s Cluster", "CI/CD Pipeline", "Infrastructure as Code"],
    resources: ["DevOps Roadmap", "Kubernetes Docs", "AWS Training", "Terraform Docs"],
  },
};

// Default export for the page component
export default function RoadmapPage({ params }: { params: { slug: string } }) {
  const data = roadmapData[params.slug] || {
    title: "Developer Roadmap",
    description: "Personalized learning path for you",
    skills: ["JavaScript", "React", "Node.js", "Database", "Git", "Testing"],
    projects: ["Build a REST API", "Create a Frontend App", "Full Stack Project", "Deploy to Cloud"],
    resources: ["FreeCodeCamp", "Codecademy", "Udemy", "YouTube Tutorials"],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E0E7FF] py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-[#3B82F6] to-[#6366F1] p-2 rounded-lg text-white">
              {"</>"}
            </div>
            <h1 className="text-xl font-semibold text-[#111827]">DevTrackr</h1>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#111827] mb-3">
            {data.title}
          </h1>
          <p className="text-[#6B7280] text-lg">
            {data.description}
          </p>
        </div>

        {/* Skills Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#E0E7FF] mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4 flex items-center gap-2">
            <span className="text-2xl">📚</span>
            Skills to Learn
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill: string) => (
              <span
                key={skill}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 text-[#3B82F6] px-3 py-1 rounded-full text-sm font-medium border border-[#CBD5F5]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#E0E7FF] mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4 flex items-center gap-2">
            <span className="text-2xl">🛠️</span>
            Portfolio Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {data.projects.map((project: string) => (
              <div
                key={project}
                className="border border-[#E0E7FF] rounded-lg p-3 hover:shadow-md transition bg-white"
              >
                <p className="text-[#111827] font-medium">{project}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#E0E7FF] mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4 flex items-center gap-2">
            <span className="text-2xl">📖</span>
            Learning Resources
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.resources.map((resource: string) => (
              <span
                key={resource}
                className="bg-gray-100 text-[#6B7280] px-3 py-1 rounded-full text-sm"
              >
                {resource}
              </span>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}