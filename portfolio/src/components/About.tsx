import { profile } from "@/lib/profile";

export default function About() {
  return (
    <section id="about" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">About</h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground">
          {profile.summary}
        </p>
      </div>
    </section>
  );
}
