import { skillGroups } from "@/lib/profile";

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">Skills</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-base font-semibold text-foreground">{group.title}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
