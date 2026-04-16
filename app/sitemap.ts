export default function sitemap() {
  return [
    {
      url: "https://devtrackr.vercel.app",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://devtrackr.vercel.app/dashboard",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://devtrackr.vercel.app/roadmap/frontend",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://devtrackr.vercel.app/roadmap/backend",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://devtrackr.vercel.app/roadmap/fullstack",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    
  ];
}