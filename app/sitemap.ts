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
    // REMOVE the /analyze entry if it exists!
  ];
}