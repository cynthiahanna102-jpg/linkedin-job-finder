import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 90;

const MAX_CV_BYTES = 6 * 1024 * 1024;

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_JOBMATCH_WEBHOOK_URL;

  if (!webhookUrl || webhookUrl.includes("your-n8n")) {
    return NextResponse.json(
      { error: "Job Match isn't configured yet — set N8N_JOBMATCH_WEBHOOK_URL in .env.local." },
      { status: 200 }
    );
  }

  let incoming: FormData;
  try {
    incoming = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const cv = incoming.get("cv");
  if (!(cv instanceof File) || cv.size === 0) {
    return NextResponse.json({ error: "Please attach your CV as a PDF." }, { status: 400 });
  }
  if (cv.size > MAX_CV_BYTES) {
    return NextResponse.json({ error: "That PDF is too large (max 5 MB)." }, { status: 400 });
  }

  const outgoing = new FormData();
  for (const [key, value] of incoming.entries()) {
    if (value instanceof File) {
      outgoing.append(key, value, value.name || "cv.pdf");
    } else {
      outgoing.append(key, value);
    }
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      body: outgoing,
      signal: AbortSignal.timeout(90_000),
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          error: `The matching workflow returned ${res.status}. Make sure the n8n workflow is active.`,
        },
        { status: 200 }
      );
    }

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data);
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    return NextResponse.json(
      {
        error: timedOut
          ? "The search timed out. Try again in a moment."
          : "Couldn't reach the matching backend.",
      },
      { status: 200 }
    );
  }
}
