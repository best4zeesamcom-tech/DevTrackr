export default function sitemap() {
  return [
    {
      url: "https://dev-trackr-7j6q.vercel.app",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://dev-trackr-7j6q.vercel.app/dashboard",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}