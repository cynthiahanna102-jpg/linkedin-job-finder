import { profile } from "@/lib/profile";

export default function Hero({ onOpenChat }: { onOpenChat?: () => void }) {
  return (
    <section id="top" className="mx-auto max-w-5xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">
        {profile.location}
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
        {profile.name}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted md:text-xl">{profile.role}</p>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{profile.tagline}</p>

      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="/Cynthia_Hanna_CV.pdf"
          download
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-light"
        >
          Download CV
        </a>
        <a
          href="#contact"
          className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Get in touch
        </a>
        {onOpenChat && (
          <button
            type="button"
            onClick={onOpenChat}
            className="rounded-full border border-accent/30 bg-accent-soft px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
          >
            Ask my AI assistant →
          </button>
        )}
      </div>
    </section>
  );
}
