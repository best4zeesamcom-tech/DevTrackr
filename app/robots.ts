export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard"], // Don't index dashboard pages
    },
    sitemap: "https://dev-trackr-7j6q.vercel.app/sitemap.xml",
  };
}