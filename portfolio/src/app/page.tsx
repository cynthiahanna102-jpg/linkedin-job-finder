import type { Metadata } from "next";
import Nav from "@/components/Nav";
import JobMatchApp from "@/components/JobMatchApp";

export const metadata: Metadata = {
  title: "LinkedIn Job Finder — AI CV Matching",
  description:
    "Upload your CV and targeting preferences; an AI backend builds a tailored LinkedIn search, pulls live postings, and ranks them by fit. Every result links straight to the job on LinkedIn.",
};

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <JobMatchApp />
      </main>
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} LinkedIn Job Finder · results come from LinkedIn&apos;s public job feed.
      </footer>
    </>
  );
}
