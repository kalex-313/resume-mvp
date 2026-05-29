const CONTENT_LASTMOD = "2026-05-29";

const urls = [
  { path: "/", priority: "1.0" },
  { path: "/ai-resume-builder", priority: "0.9" },
  { path: "/ats-resume-templates", priority: "0.9" },
  { path: "/resume-builder-canada", priority: "0.85" },
  { path: "/student-resume-builder", priority: "0.85" },
  { path: "/career-change-resume-builder", priority: "0.85" },
  { path: "/entry-level-resume-builder", priority: "0.85" },
  { path: "/resume-pdf-export", priority: "0.85" },
  { path: "/templates", priority: "0.85" },
  { path: "/pricing", priority: "0.8" },
  { path: "/contact", priority: "0.5" },
  { path: "/privacy", priority: "0.3" },
  { path: "/terms", priority: "0.3" },
];

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function renderUrl(path: string, priority: string) {
  const loc = `https://www.rolearc.xyz${path === "/" ? "/" : path}`;

  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${CONTENT_LASTMOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export function GET() {
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => renderUrl(url.path, url.priority)).join("\n")}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
