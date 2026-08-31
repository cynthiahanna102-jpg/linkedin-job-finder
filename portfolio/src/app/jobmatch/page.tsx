import type { Metadata } from "next";
import Nav from "@/components/Nav";
import JobMatchApp from "@/components/JobMatchApp";

export const metadata: Metadata = {
  title: "AI Job Match — Cynthia Hanna",
  description:
    "Upload a CV and your targeting preferences; an AI backend builds a tailored LinkedIn search, pulls live postings, and ranks them by fit with a salary reality-check.",
};

export default function JobMatchPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <JobMatchApp />
      </main>
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} Cynthia Hanna · AI Job Match is a demo project.
      </footer>
    </>
  );
}
