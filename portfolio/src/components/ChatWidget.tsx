"use client";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

type Message = { role: "user" | "assistant"; content: string };

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi, I'm Cynthia's AI assistant. Ask me about her skills, projects, experience, or anything on her CV.",
};

function getSessionId() {
  if (typeof window === "undefined") return "";
  const key = "cynthia-chat-session";
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(key, id);
  }
  return id;
}

export type ChatWidgetHandle = { open: () => void };

const ChatWidget = forwardRef<ChatWidgetHandle>(function ChatWidget(_props, ref) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({ open: () => setOpen(true) }));

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: getSessionId() }),
      });
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      const reply = typeof data.reply === "string" ? data.reply : "Sorry, I couldn't get a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setError(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please reach out directly via email in the meantime.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform hover:scale-105"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12a8 8 0 1 1 3.2 6.4L4 20l1.2-3.6A7.96 7.96 0 0 1 4 12Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <div className="border-b border-border bg-accent px-4 py-3 text-white">
            <p className="text-sm font-semibold">Ask about Cynthia</p>
            <p className="text-xs text-white/80">Usually replies instantly</p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-accent text-white"
                    : "bg-surface text-foreground"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] rounded-2xl bg-surface px-3 py-2 text-sm text-muted">
                Typing…
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              Send
            </button>
          </form>
          {error && (
            <p className="px-4 pb-2 text-xs text-red-500">
              Connection issue — the chatbot backend may not be running yet.
            </p>
          )}
        </div>
      )}
    </>
  );
});

export default ChatWidget;
