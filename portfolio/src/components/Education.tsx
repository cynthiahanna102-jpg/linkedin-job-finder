import { education, leadership } from "@/lib/profile";

export default function Education() {
  return (
    <section id="education" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
              Education
            </h2>
            <div className="mt-6 space-y-6">
              {education.map((item) => (
                <div key={item.degree}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold text-foreground">{item.degree}</h3>
                    <span className="text-sm text-muted">{item.dates}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{item.org}</p>
                  {item.detail && <p className="mt-1 text-sm text-muted">{item.detail}</p>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
              Leadership & Activities
            </h2>
            <div className="mt-6 space-y-6">
              {leadership.map((item) => (
                <div key={item.title}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <span className="text-sm text-muted">{item.dates}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{item.org}</p>
                  {item.detail && <p className="mt-1 text-sm text-muted">{item.detail}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
