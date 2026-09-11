"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="card p-6 sm:p-8">
        <h2 className="display text-2xl">Message saved on this device</h2>
        <p className="mt-3 text-charcoal-600">
          Contact delivery is not wired yet. When email or the CRM is connected, this form will send for real. Nothing
          left this browser.
        </p>
        {/* TODO(supabase): insert contact_messages or post to an email function. */}
      </div>
    );
  }

  return (
    <form
      className="card space-y-4 p-6 sm:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="label">Name</span>
          <input className="field" name="name" required autoComplete="name" />
        </label>
        <label className="block">
          <span className="label">Email</span>
          <input className="field" type="email" name="email" required autoComplete="email" />
        </label>
      </div>
      <label className="block">
        <span className="label">Phone</span>
        <input className="field" type="tel" name="phone" autoComplete="tel" />
      </label>
      <label className="block">
        <span className="label">Message</span>
        <textarea className="field min-h-36" name="message" required />
      </label>
      <button type="submit" className="btn-primary">
        Send message
      </button>
    </form>
  );
}
