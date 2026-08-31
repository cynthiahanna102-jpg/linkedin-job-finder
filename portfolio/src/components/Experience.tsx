import { experience } from "@/lib/profile";

export default function Experience() {
  return (
    <section id="experience" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
          Experience
        </h2>
        <div className="mt-8 space-y-10">
          {experience.map((job) => (
            <div key={job.title}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {job.title} <span className="font-normal text-muted">· {job.org}</span>
                </h3>
                <span className="text-sm text-muted">{job.dates}</span>
              </div>
              <ul className="mt-3 space-y-2">
                {job.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
