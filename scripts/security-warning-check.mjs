import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const productionUrl =
  process.env.SECURITY_CHECK_BASE_URL || "https://www.rolearc.xyz";

const requiredHeaders = [
  "content-security-policy",
  "strict-transport-security",
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy",
  "permissions-policy",
];

const requiredCspParts = [
  "default-src 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "https://checkout.stripe.com",
  "https://billing.stripe.com",
  "https://challenges.cloudflare.com",
];

const checks = [];

function record(name, ok, detail) {
  checks.push({ name, ok, detail });
}

async function head(pathname) {
  const response = await fetch(new URL(pathname, productionUrl), {
    method: "HEAD",
    redirect: "manual",
  });

  return {
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
  };
}

async function checkProductionHeaders() {
  const response = await head("/");
  record(
    "Production homepage returns 200",
    response.status === 200,
    `status=${response.status}`
  );

  for (const header of requiredHeaders) {
    record(
      `Production header: ${header}`,
      Boolean(response.headers[header]),
      response.headers[header] ? "present" : "missing"
    );
  }

  const csp = response.headers["content-security-policy"] || "";
  for (const part of requiredCspParts) {
    record(`CSP allows/blocks: ${part}`, csp.includes(part), "checked");
  }
}

async function checkProtectedHealthRoute() {
  const response = await head("/api/health/supabase");
  record(
    "Supabase keep-alive route rejects unauthenticated requests",
    response.status === 401,
    `status=${response.status}`
  );
}

function checkVercelCronConfig() {
  const vercelPath = path.join(root, "vercel.json");
  const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, "utf8"));
  const supabaseCrons = (vercelConfig.crons || []).filter(
    (cron) => cron.path === "/api/health/supabase"
  );

  record(
    "Vercel cron has two Supabase keep-alive runs",
    supabaseCrons.length === 2,
    `count=${supabaseCrons.length}`
  );

  const schedules = supabaseCrons.map((cron) => cron.schedule).sort();
  record(
    "Vercel cron schedule includes 09:00 and 21:00 UTC",
    schedules.includes("0 9 * * *") && schedules.includes("0 21 * * *"),
    schedules.join(", ")
  );
}

function checkSecurityConfigFiles() {
  const nextConfig = fs
    .readFileSync(path.join(root, "next.config.mjs"), "utf8")
    .toLowerCase();
  const healthRoute = fs.readFileSync(
    path.join(root, "src/app/api/health/supabase/route.ts"),
    "utf8"
  );

  record(
    "Next.js security headers are configured",
    requiredHeaders.every((header) => nextConfig.includes(header)),
    "next.config.mjs"
  );

  record(
    "Supabase keep-alive route requires CRON_SECRET",
    healthRoute.includes("CRON_SECRET") &&
      healthRoute.includes("authorization") &&
      healthRoute.includes("Bearer"),
    "src/app/api/health/supabase/route.ts"
  );
}

async function main() {
  await checkProductionHeaders();
  await checkProtectedHealthRoute();
  checkVercelCronConfig();
  checkSecurityConfigFiles();

  const failed = checks.filter((check) => !check.ok);

  for (const check of checks) {
    const marker = check.ok ? "PASS" : "FAIL";
    console.log(`${marker} ${check.name} - ${check.detail}`);
  }

  if (failed.length > 0) {
    console.error(`\n${failed.length} security warning check(s) failed.`);
    process.exit(1);
  }

  console.log("\nAll security warning checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
