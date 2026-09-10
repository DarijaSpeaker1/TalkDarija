import { Resend } from "resend";

type RequestBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

type VercelRequest = {
  method?: string;
  body?: RequestBody;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
  end: () => void;
};

declare const process: {
  env: Record<string, string | undefined>;
};

const feedbackRecipient = "feedback.talkdarija@gmail.com";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!message || message.length > 5000) {
    res.status(400).json({ error: "Please enter a message of up to 5,000 characters." });
    return;
  }
  if (name.length > 100 || email.length > 254 || (email && !/^\S+@\S+\.\S+$/.test(email))) {
    res.status(400).json({ error: "Please check the optional name and email fields." });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    res.status(503).json({ error: "Feedback is temporarily unavailable. Please try again later." });
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [feedbackRecipient],
      replyTo: email || undefined,
      subject: "New TalkDarija Feedback",
      text: [
        name ? `User name: ${name}` : "User name: Not provided",
        email ? `User email: ${email}` : "User email: Not provided",
        "",
        `Feedback message:\n${message}`,
      ].join("\n"),
    });

    if (error) {
      
      res.status(502).json({ error: "We could not send your feedback right now. Please try again." });
      return;
    }

    res.status(204).end();
  } catch (error) {
    res.status(502).json({ error: "We could not send your feedback right now. Please try again." });
  }
}
