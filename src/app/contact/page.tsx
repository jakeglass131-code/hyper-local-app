"use client";

import { useState } from "react";
import { WebsiteShell } from "@/components/website/WebsiteShell";

type ContactState = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<ContactState>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setState("error");
      setStatusMessage("Please complete all fields.");
      return;
    }

    setState("sending");
    setStatusMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setState("sent");
      setStatusMessage("Thanks. Your message was sent successfully.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setState("error");
      setStatusMessage("Unable to send right now. Please try again.");
    }
  };

  return (
    <WebsiteShell>
      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-3xl border border-[#dfe5df] bg-white p-6 sm:p-8">
          <h1 className="text-3xl font-black tracking-tight text-[#1f2a2a]">Contact Us</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#5f6d68]">
            Questions about offers, account access, or business onboarding? Send us a message.
          </p>
          <div className="mt-6 space-y-3 text-sm text-[#4d5d58]">
            <p><span className="font-semibold text-[#1f2a2a]">Email:</span> support@hyper-local.app</p>
            <p><span className="font-semibold text-[#1f2a2a]">Phone:</span> +1 (888) 555-0143</p>
            <p><span className="font-semibold text-[#1f2a2a]">Hours:</span> Mon–Fri, 9:00 AM – 6:00 PM ET</p>
          </div>
        </article>

        <article className="rounded-3xl border border-[#dfe5df] bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[#1f2a2a]">Send a message</h2>
          <form className="mt-4 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-sm font-semibold text-[#293632]">Name</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#d9e2dc] px-3.5 py-3 text-sm text-[#1f2a2a] outline-none focus:border-[#3744D2]"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#293632]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#d9e2dc] px-3.5 py-3 text-sm text-[#1f2a2a] outline-none focus:border-[#3744D2]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#293632]">Message</label>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={5}
                className="mt-1.5 w-full resize-none rounded-xl border border-[#d9e2dc] px-3.5 py-3 text-sm text-[#1f2a2a] outline-none focus:border-[#3744D2]"
                placeholder="How can we help?"
              />
            </div>

            <button
              type="submit"
              disabled={state === "sending"}
              className="w-full rounded-xl bg-[#3744D2] px-4 py-3 text-sm font-semibold text-white hover:bg-[#2d36ab] disabled:opacity-70"
            >
              {state === "sending" ? "Sending..." : "Send Message"}
            </button>

            {statusMessage ? (
              <p className={`text-sm ${state === "error" ? "text-red-600" : "text-emerald-600"}`}>{statusMessage}</p>
            ) : null}
          </form>
        </article>
      </section>
    </WebsiteShell>
  );
}
