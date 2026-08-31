# JobMatch AI

AI job-matching demo: a candidate uploads their CV (PDF) and answers a few targeting
questions; an n8n backend reads the CV, builds a tailored LinkedIn search, pulls live
postings, and returns them **ranked by fit** with a salary reality-check.

```
Browser form ──(multipart/form-data)──► n8n Webhook
                                          │
                    Extract CV text (PDF) │
                    Normalize answers     │
   Groq LLM #1  ◄── build LinkedIn search (keywords + filter codes)
                    Fetch LinkedIn public jobs feed
                    Parse job cards
   Groq LLM #2  ◄── score every job vs. CV + wants + salary
                                          │
Browser  ◄──────────(ranked JSON)─────────┘
```

## Files

| File | Purpose |
|------|---------|
| `index.html` | The single-page site |
| `styles.css` | Styling |
| `app.js` | Form handling, request, results rendering |
| `config.js` | **Edit this** — your n8n webhook URL / demo toggle |

## Setup

### 1. Backend (n8n)

The workflow **"JobMatch AI - CV to LinkedIn Jobs"** is already in your n8n:
https://cynthia1.app.n8n.cloud/workflow/wuhgoRhGMhr2yXM9

1. Get a **free Groq API key**: https://console.groq.com → *API Keys* → *Create*.
2. In n8n, open the workflow. On **Groq Model (Search)**, create a new *Groq* credential
   with that key. On **Groq Model (Rank)**, pick the same credential.
3. Click **Active** (top-right toggle) to activate the workflow.
4. Open the **Find Jobs Webhook** node and copy its **Production URL**
   (`https://cynthia1.app.n8n.cloud/webhook/find-jobs`).

### 2. Frontend

1. Open `config.js` and set:
   ```js
   WEBHOOK_URL: "https://cynthia1.app.n8n.cloud/webhook/find-jobs",
   ```
2. Open `index.html` in a browser (or host the folder on any static host —
   GitHub Pages, Netlify, Vercel, `npx serve`).

### Try the UI without the backend

Set `DEMO_MODE: true` in `config.js` — the page renders sample results and never
calls n8n.

## The questions the form asks

Full name · CV (PDF) · target job title · expected salary + currency + period ·
preferred location · work arrangement (remote/hybrid/on-site) · experience level ·
job type · "posted within" window · key skills to emphasize · free-text notes.

## Response shape (n8n → browser)

```json
{
  "success": true,
  "query": { "keywords": "...", "location": "..." },
  "assessment": { "candidateSummary": "...", "salaryAssessment": "..." },
  "count": 12,
  "jobs": [
    { "title": "...", "company": "...", "location": "...", "url": "...",
      "postedDate": "...", "matchScore": 87, "reasoning": "...",
      "salaryFit": "Likely in range" }
  ],
  "overallAdvice": "..."
}
```

## Notes & limits

- **LinkedIn source**: uses LinkedIn's public *guest* jobs feed (no login, no API key).
  It can rate-limit or return nothing intermittently; the workflow degrades gracefully
  and returns an empty list. For production, swap the **Fetch LinkedIn Jobs** node for a
  scraping provider (Apify, Bright Data) or a jobs API.
- CVs are forwarded once to your n8n backend and are not stored by the page.
- Groq free tier has rate limits; heavy testing may hit them.
