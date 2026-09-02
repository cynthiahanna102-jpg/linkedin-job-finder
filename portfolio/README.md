# LinkedIn Job Finder

Next.js 16 + React 19 + Tailwind v4 web app that finds LinkedIn jobs for your CV.

Upload a CV (PDF) + targeting answers → an n8n workflow extracts the CV text, an LLM
builds a tailored LinkedIn search, the public LinkedIn guest feed is fetched and parsed,
a second LLM scores each posting against the CV + salary, and ranked results come back
as JSON. Each result on screen links straight to the job on LinkedIn.

| Route | Front end | API route | n8n webhook env var |
|---|---|---|---|
| `/` | `components/JobMatchApp.tsx` | `app/api/jobmatch/route.ts` | `N8N_JOBMATCH_WEBHOOK_URL` |

The browser only ever talks to the same-origin `/api/jobmatch` route; it forwards to n8n
server-side, so there's no CORS setup and no webhook URL in client code.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in N8N_JOBMATCH_WEBHOOK_URL
npm run dev
```

## The n8n workflow

**Workflow:** "JobMatch AI - CV to LinkedIn Jobs" —
https://cynthia1.app.n8n.cloud/workflow/wuhgoRhGMhr2yXM9

**LLM — no API key.** The two `AI ...` nodes call an OpenAI-compatible
`/v1/chat/completions` endpoint, defaulting to a local **Ollama** model:

1. `ollama pull llama3.2` (keep `ollama serve` running)
2. n8n Cloud can't see localhost — tunnel it (no account):
   `npx cloudflared tunnel --url http://localhost:11434`
3. Set the printed `…/v1/chat/completions` URL on the **AI Build Search** and
   **AI Rank Jobs** nodes, then activate the workflow.
4. Put the **Find Jobs Webhook** Production URL in `N8N_JOBMATCH_WEBHOOK_URL`.

Prefer hosted? Point those node URLs at OpenRouter / Groq / LM Studio / vLLM instead
(add an HTTP Header Auth credential if a key is needed). If the model is unreachable the
workflow still returns LinkedIn jobs, just unranked.

Expected `/api/jobmatch` response:

```json
{
  "success": true,
  "query": { "keywords": "...", "location": "..." },
  "assessment": { "candidateSummary": "...", "salaryAssessment": "..." },
  "count": 12,
  "jobs": [
    { "title": "...", "company": "...", "location": "...", "url": "...",
      "postedDate": "...", "matchScore": 87, "reasoning": "...", "salaryFit": "Likely in range" }
  ],
  "overallAdvice": "..."
}
```

### Limits

- LinkedIn's public guest feed can rate-limit / return nothing; the workflow degrades to
  an empty list. For production swap the **Fetch LinkedIn Jobs** node for Apify / Bright Data.
- `llama3.2` (3B) is fast but light — use a larger model for sharper ranking.
- CVs are forwarded once to the automation backend and not stored by the site.
