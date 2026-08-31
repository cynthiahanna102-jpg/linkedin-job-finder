import Link from "next/link";
import { projects } from "@/lib/profile";

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">Projects</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.title}
            className="flex flex-col rounded-2xl border border-border bg-surface p-6"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              {project.subtitle}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-foreground">{project.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
              {project.description}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"
                >
                  {tag}
                </li>
              ))}
            </ul>
            {project.href && (
              <Link
                href={project.href}
                className="mt-4 inline-block text-sm font-medium text-accent transition-colors hover:text-accent-light"
              >
                Try it live →
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
