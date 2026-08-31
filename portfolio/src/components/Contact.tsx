import { profile } from "@/lib/profile";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">Contact</h2>
      <p className="mt-4 max-w-2xl text-lg text-foreground">
        Recruiting for an AI-focused Business Analyst role? I&apos;d love to hear from you —
        or ask my chatbot in the corner anything about my background first.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href={`mailto:${profile.email}`}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-light"
        >
          {profile.email}
        </a>
        <a
          href={`tel:${profile.phone.replace(/\s+/g, "")}`}
          className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          {profile.phone}
        </a>
      </div>
    </section>
  );
}
