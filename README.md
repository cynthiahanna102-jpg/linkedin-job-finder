# LinkedIn Job Finder

The deployable app lives in [`portfolio/`](portfolio/) — a Next.js 16 site that reads your
CV and finds matching LinkedIn jobs, ranked by fit, each linking straight to the posting.
Backed by an n8n workflow that runs the CV extraction + LLM ranking.

## Deploy on Vercel

Import this repo and set **Root Directory → `portfolio`**, then add the env var from
[`portfolio/.env.example`](portfolio/.env.example):

| Var | Value |
|-----|-------|
| `N8N_JOBMATCH_WEBHOOK_URL` | `https://cynthia1.app.n8n.cloud/webhook/find-jobs` |

Full details, including the local-LLM (Ollama) setup for the workflow, are in
[`portfolio/README.md`](portfolio/README.md).

## Local dev

```bash
cd portfolio
npm install
cp .env.example .env.local   # fill in the webhook URL
npm run dev
```
