/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "form-action 'self' https://checkout.stripe.com https://billing.stripe.com",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com https://vercel.live https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://api.openrouter.ai https://generativelanguage.googleapis.com https://www.google-analytics.com https://analytics.google.com https://vitals.vercel-insights.com https://vercel.live https://challenges.cloudflare.com",
      "frame-src https://checkout.stripe.com https://billing.stripe.com https://vercel.live https://challenges.cloudflare.com",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/resume-builder",
        destination: "/ai-resume-builder",
        permanent: true,
      },
      {
        source: "/ai-resume",
        destination: "/ai-resume-builder",
        permanent: true,
      },
      {
        source: "/resume-templates",
        destination: "/templates",
        permanent: true,
      },
      {
        source: "/ats-templates",
        destination: "/ats-resume-templates",
        permanent: true,
      },
      {
        source: "/pdf-export",
        destination: "/resume-pdf-export",
        permanent: true,
      },
      {
        source: "/features",
        destination: "/",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/auth/login",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/auth/signup",
        permanent: true,
      },
      {
        source: "/checkout",
        destination: "/upgrade",
        permanent: true,
      },
      {
        source: "/billing",
        destination: "/pricing",
        permanent: true,
      },
      {
        source: "/cvforge",
        destination: "/",
        permanent: true,
      },
      {
        source: "/cvforge/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
