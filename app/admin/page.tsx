"use client";

import { useEffect, useState } from "react";
import { prices } from "@/lib/pricing";

const STORAGE_KEY = "bcdv-admin";
const expected = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "changeme";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(STORAGE_KEY) === "ok");
  }, []);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password === expected) {
      sessionStorage.setItem(STORAGE_KEY, "ok");
      setUnlocked(true);
      setError("");
      return;
    }
    setError("Wrong password.");
  }

  if (!unlocked) {
    return (
      <section className="site-wrap max-w-md py-16">
        <h1 className="display text-3xl">Ops admin</h1>
        <p className="mt-2 text-sm text-charcoal-600">Static gate only. Not a live account system.</p>
        <form className="mt-6 space-y-3" onSubmit={submit}>
          <label className="block">
            <span className="label">Password</span>
            <input
              className="field"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button type="submit" className="btn-primary">
            Enter
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="site-wrap space-y-6 py-12">
      <h1 className="display text-3xl">Ops admin</h1>
      <p className="text-charcoal-600">Internal stubs. Route-fill is never shown on the public site.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="card p-6">
          <p className="kicker">Capacity</p>
          <p className="mt-2 font-semibold">Empty book</p>
          <p className="mt-2 text-sm text-charcoal-600">No times open yet — join waitlist / leave contact</p>
        </article>
        <article className="card p-6">
          <p className="kicker">Route-fill (ops only)</p>
          <p className="mt-2 font-semibold">${prices["route-fill"].amount} — not public</p>
          <p className="mt-2 text-sm text-charcoal-600">Offer link: /book/?offer=route</p>
        </article>
      </div>
    </section>
  );
}
