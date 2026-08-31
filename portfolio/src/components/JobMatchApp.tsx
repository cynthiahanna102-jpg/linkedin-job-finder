"use client";

import { useEffect, useRef, useState } from "react";

type Job = {
  title: string;
  company?: string;
  location?: string;
  url?: string;
  postedDate?: string;
  matchScore?: number;
  reasoning?: string;
  salaryFit?: string;
};

type ApiResult = {
  success?: boolean;
  query?: { keywords?: string; location?: string };
  assessment?: { candidateSummary?: string; salaryAssessment?: string };
  count?: number;
  jobs?: Job[];
  rankedJobs?: Job[];
  overallAdvice?: string;
  error?: string;
};

const LOADING_STEPS = [
  "Extracting your experience from the CV",
  "Building a tailored LinkedIn search",
  "Searching live LinkedIn postings",
  "Scoring each job against what you want",
];

const MAX_MB = 5;

const field =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent";
const label = "text-sm font-medium text-foreground";

export default function JobMatchApp() {
  const [view, setView] = useState<"form" | "loading" | "results">("form");
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (view !== "loading") return;
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1)),
      2600
    );
    return () => clearInterval(id);
  }, [view]);

  function validateFile(file: File | undefined): string | null {
    if (!file) return "Please attach your CV as a PDF.";
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name))
      return "Please upload a PDF file.";
    if (file.size > MAX_MB * 1024 * 1024)
      return `That PDF is larger than ${MAX_MB} MB.`;
    return null;
  }

  function onFileChange(file: File | undefined) {
    const err = validateFile(file);
    if (err) {
      setError(err);
      setFileName(null);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setError(null);
    setFileName(file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)` : null);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const cv = data.get("cv");
    const fileErr = validateFile(cv instanceof File ? cv : undefined);
    if (fileErr) {
      setError(fileErr);
      return;
    }

    setStep(0);
    setView("loading");

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 95_000);
      const res = await fetch("/api/jobmatch", {
        method: "POST",
        body: data,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const json: ApiResult = await res.json().catch(() => ({}));

      if (json.error) {
        setError(json.error);
        setView("form");
        return;
      }

      setResult(json);
      setView("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err instanceof Error && err.name === "AbortError"
          ? "The search timed out. Please try again."
          : "Something went wrong reaching the backend. Please try again."
      );
      setView("form");
    }
  }

  function restart() {
    setResult(null);
    setError(null);
    setView("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------------- loading ---------------- */
  if (view === "loading") {
    return (
      <section className="mx-auto max-w-5xl px-6 py-28 text-center">
        <div className="mx-auto mb-8 h-11 w-11 animate-spin rounded-full border-4 border-border border-t-accent" />
        <h1 className="text-xl font-semibold text-foreground">
          Reading your CV and searching LinkedIn…
        </h1>
        <p className="mt-2 text-sm text-muted">{LOADING_STEPS[step]}</p>
      </section>
    );
  }

  /* ---------------- results ---------------- */
  if (view === "results" && result) {
    const jobs = [...(result.jobs ?? result.rankedJobs ?? [])].sort(
      (a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0)
    );
    const summary = result.assessment?.candidateSummary;
    const salary = result.assessment?.salaryAssessment;

    return (
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Your job matches
            </h1>
            <p className="mt-1 text-sm text-muted">
              {jobs.length} posting{jobs.length === 1 ? "" : "s"} found
              {result.query?.keywords ? ` for “${result.query.keywords}”` : ""}.
            </p>
          </div>
          <button
            type="button"
            onClick={restart}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            New search
          </button>
        </div>

        {(summary || salary) && (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">
              AI assessment
            </h2>
            {summary && <p className="mt-3 text-sm leading-relaxed text-foreground">{summary}</p>}
            {salary && <p className="mt-2 text-sm leading-relaxed text-muted">{salary}</p>}
          </div>
        )}

        {result.overallAdvice && (
          <p className="mt-4 text-sm leading-relaxed text-muted">{result.overallAdvice}</p>
        )}

        {jobs.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
            No postings came back for this search. Try widening the location, extending the
            “posted within” window, or loosening the experience level.
          </p>
        ) : (
          <div className="mt-8 grid gap-4">
            {jobs.map((job, i) => {
              const score = Math.max(0, Math.min(100, Math.round(job.matchScore ?? 0)));
              const tone =
                score >= 75
                  ? "text-emerald-600"
                  : score >= 50
                    ? "text-amber-600"
                    : "text-rose-600";
              return (
                <article
                  key={`${job.url ?? job.title}-${i}`}
                  className="rounded-2xl border border-border bg-surface p-5 md:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-foreground md:text-lg">
                        {job.url ? (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-accent"
                          >
                            {job.title || "Untitled role"}
                          </a>
                        ) : (
                          job.title || "Untitled role"
                        )}
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        {[job.company, job.location, job.postedDate].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <div className="shrink-0 text-center">
                      <div className={`text-xl font-bold leading-none ${tone}`}>{score}</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted">match</div>
                    </div>
                  </div>

                  {job.reasoning && (
                    <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-foreground">
                      {job.reasoning}
                      {job.salaryFit && (
                        <span className="mt-1 block text-xs text-muted">
                          Salary: {job.salaryFit}
                        </span>
                      )}
                    </p>
                  )}

                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm font-medium text-accent hover:text-accent-light"
                    >
                      View on LinkedIn →
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    );
  }

  /* ---------------- form ---------------- */
  return (
    <section className="mx-auto max-w-5xl px-6 pt-16 pb-16 md:pt-20">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-accent">AI Job Match</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Upload your CV. Get the LinkedIn jobs that actually fit.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            An AI backend reads your CV, weighs it against the role and salary you want, then
            searches live LinkedIn postings and ranks them by how well they match.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-foreground">
            <li>• Search query tailored from your experience</li>
            <li>• Every match scored 0–100 with a reason</li>
            <li>• Salary-expectation reality check included</li>
          </ul>
          <p className="mt-6 text-xs text-muted">
            This is a demo of Cynthia&apos;s AI Career-Matching project. Your CV is forwarded
            once to the automation backend and is not stored by this page.
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="rounded-2xl border border-border bg-surface p-6 md:p-7"
        >
          <h2 className="text-base font-semibold text-foreground">Tell us what you&apos;re looking for</h2>

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className={label}>Full name</label>
              <input id="fullName" name="fullName" type="text" required placeholder="Jane Doe" className={field} />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cv" className={label}>
                Your CV <span className="font-normal text-muted">(PDF, max {MAX_MB} MB)</span>
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  const dropped = e.dataTransfer.files?.[0];
                  if (dropped && fileRef.current) {
                    const dt = new DataTransfer();
                    dt.items.add(dropped);
                    fileRef.current.files = dt.files;
                    onFileChange(dropped);
                  }
                }}
                className={`relative rounded-lg border border-dashed px-4 py-6 text-center text-sm transition-colors ${
                  dragging
                    ? "border-accent bg-accent-soft"
                    : fileName
                      ? "border-emerald-500 text-emerald-600"
                      : "border-border text-muted"
                }`}
              >
                <input
                  ref={fileRef}
                  id="cv"
                  name="cv"
                  type="file"
                  accept="application/pdf,.pdf"
                  required
                  onChange={(e) => onFileChange(e.target.files?.[0])}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                {fileName ?? (
                  <>
                    Drag &amp; drop or <span className="text-accent underline">browse</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="jobTitle" className={label}>Target job title / role</label>
              <input id="jobTitle" name="jobTitle" type="text" required placeholder="Senior Data Analyst" className={field} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="salaryExpectation" className={label}>Expected salary</label>
                <input id="salaryExpectation" name="salaryExpectation" type="number" min={0} required placeholder="75000" className={field} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="salaryCurrency" className={label}>Currency</label>
                  <select id="salaryCurrency" name="salaryCurrency" defaultValue="USD" className={field}>
                    {["USD", "EUR", "GBP", "CAD", "AUD", "AED", "INR"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="salaryPeriod" className={label}>Per</label>
                  <select id="salaryPeriod" name="salaryPeriod" defaultValue="year" className={field}>
                    <option value="year">year</option>
                    <option value="month">month</option>
                    <option value="hour">hour</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="location" className={label}>Preferred location</label>
                <input id="location" name="location" type="text" required placeholder="Berlin, Germany" className={field} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="workArrangement" className={label}>Work arrangement</label>
                <select id="workArrangement" name="workArrangement" defaultValue="any" className={field}>
                  <option value="any">No preference</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="experienceLevel" className={label}>Experience level</label>
                <select id="experienceLevel" name="experienceLevel" defaultValue="mid-senior" className={field}>
                  <option value="internship">Internship</option>
                  <option value="entry">Entry level</option>
                  <option value="associate">Associate</option>
                  <option value="mid-senior">Mid–Senior</option>
                  <option value="director">Director</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="jobType" className={label}>Job type</label>
                <select id="jobType" name="jobType" defaultValue="full-time" className={field}>
                  <option value="any">Any</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="datePosted" className={label}>Posted within</label>
                <select id="datePosted" name="datePosted" defaultValue="week" className={field}>
                  <option value="any">Any time</option>
                  <option value="24h">Past 24 hours</option>
                  <option value="week">Past week</option>
                  <option value="month">Past month</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="skills" className={label}>
                  Key skills <span className="font-normal text-muted">(optional)</span>
                </label>
                <input id="skills" name="skills" type="text" placeholder="SQL, Python, dashboards" className={field} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="notes" className={label}>
                Anything else you want in a role? <span className="font-normal text-muted">(optional)</span>
              </label>
              <textarea id="notes" name="notes" rows={2} placeholder="Prefer health-tech, strong mentorship, no on-call." className={`${field} resize-y`} />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-light"
          >
            Find my matches
          </button>

          {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        </form>
      </div>
    </section>
  );
}
