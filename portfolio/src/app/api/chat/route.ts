import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_CHAT_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { reply: "The chatbot isn't configured yet — N8N_CHAT_WEBHOOK_URL is missing." },
      { status: 200 }
    );
  }

  let body: { message?: unknown; sessionId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.slice(0, 2000) : "";
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : "anonymous";

  if (!message.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId }),
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { reply: "The assistant is temporarily unavailable. Please try again shortly." },
        { status: 200 }
      );
    }

    const data = await res.json().catch(() => ({}));
    const reply =
      typeof data.reply === "string"
        ? data.reply
        : typeof data.output === "string"
          ? data.output
          : "Sorry, I didn't get a clear response for that.";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "The assistant is temporarily unavailable. Please try again shortly." },
      { status: 200 }
    );
  }
}
