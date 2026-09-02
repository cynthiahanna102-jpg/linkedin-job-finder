import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Falls back to the project's n8n webhook when no env var is set (e.g. a
    // plain Vercel deploy). Set N8N_JOBMATCH_WEBHOOK_URL to override.
    N8N_JOBMATCH_WEBHOOK_URL:
      process.env.N8N_JOBMATCH_WEBHOOK_URL ??
      "https://cynthia1.app.n8n.cloud/webhook/find-jobs",
  },
};

export default nextConfig;
