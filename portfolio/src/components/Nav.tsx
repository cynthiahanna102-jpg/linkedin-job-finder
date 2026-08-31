"use client";

import { useState } from "react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-semibold tracking-tight text-foreground">
          Cynthia Hanna
        </a>

        <ul className="hidden gap-8 text-sm text-muted md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-accent">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/Cynthia_Hanna_CV.pdf"
          download
          className="hidden rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-light md:inline-block"
        >
          Download CV
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="rounded-md border border-border p-2 text-foreground md:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4 text-sm text-muted">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)} className="hover:text-accent">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/Cynthia_Hanna_CV.pdf" download className="font-medium text-accent">
                Download CV
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
