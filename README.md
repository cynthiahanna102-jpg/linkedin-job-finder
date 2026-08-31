# Cynthia Hanna — Portfolio (repo)

The deployable app lives in [`portfolio/`](portfolio/) — a Next.js 16 site with two
AI features (recruiter chatbot + AI Job Match), each backed by an n8n workflow.

## Deploy on Vercel

Import this repo and set **Root Directory → `portfolio`**, then add the env vars from
[`portfolio/.env.example`](portfolio/.env.example):

| Var | Value |
|-----|-------|
| `N8N_CHAT_WEBHOOK_URL` | `https://cynthia1.app.n8n.cloud/webhook/cynthia-chat` |
| `N8N_JOBMATCH_WEBHOOK_URL` | `https://cynthia1.app.n8n.cloud/webhook/find-jobs` |

Full details, including the local-LLM (Ollama) setup for the Job Match workflow, are in
[`portfolio/README.md`](portfolio/README.md).

## Local dev

```bash
cd portfolio
npm install
cp .env.example .env.local   # fill in the two URLs
npm run dev
```
