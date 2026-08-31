/* ============================================================
   JobMatch AI — front-end configuration
   ------------------------------------------------------------
   Paste the PRODUCTION URL of your n8n "Find Jobs" webhook here.
   In n8n: open the workflow -> click the Webhook node -> copy
   the "Production URL". It looks like:
   https://<your-subdomain>.app.n8n.cloud/webhook/find-jobs
   ============================================================ */
window.JOBMATCH_CONFIG = {
  WEBHOOK_URL: "REPLACE_WITH_YOUR_N8N_PRODUCTION_WEBHOOK_URL",

  // If true, the page shows fake data without calling n8n — handy for
  // styling / demoing the UI before the backend is wired up.
  DEMO_MODE: false,
};
