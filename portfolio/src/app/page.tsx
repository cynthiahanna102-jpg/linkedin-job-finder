"use client";

import { useRef } from "react";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import ChatWidget, { type ChatWidgetHandle } from "@/components/ChatWidget";

export default function Home() {
  const chatRef = useRef<ChatWidgetHandle>(null);

  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero onOpenChat={() => chatRef.current?.open()} />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} Cynthia Hanna. Built with Next.js, deployed on Vercel.
      </footer>
      <ChatWidget ref={chatRef} />
    </>
  );
}
