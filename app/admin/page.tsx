"use client";

import { useState } from "react";

const PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "changeme";

export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === PASSWORD) {
      setOk(true);
      setErr("");
    } else {
      setErr("Wrong password.");
    }
  }

  if (!ok) {
    return (
      <div className="site-wrap py-16">
        <form onSubmit={submit} className="card mx-auto max-w-md space-y-4 p-6">
          <h1 className="display text-3xl">Admin</h1>
          <p className="text-sm text-charcoal-600">
            Stub gate. Password from NEXT_PUBLIC_ADMIN_PASSWORD (default changeme). Not production auth.
          </p>
          <input
            type="password"
            className="field"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
          />
          {err ? <p className="text-sm text-red-700">{err}</p> : null}
          <button className="btn-primary w-full" type="submit">
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="site-wrap space-y-6 py-16">
      <h1 className="display text-3xl">Admin stub</h1>
      <section className="card p-5">
        <h2 className="font-semibold">Jobs</h2>
        <p className="mt-2 text-sm text-charcoal-600">No live bookings yet.</p>
      </section>
      <section className="card p-5">
        <h2 className="font-semibold">Capacity</h2>
        <p className="mt-2 text-sm text-charcoal-600">
          Zero blocks seeded. Public calendar stays empty until coverage is published.
        </p>
      </section>
      <section className="card p-5">
        <h2 className="font-semibold">Published prices</h2>
        <ul className="mt-2 space-y-1 text-sm">
          <li>Standard $129</li>
          <li>Difficult $169</li>
          <li>Annual plan $109/yr</li>
          <li className="text-charcoal-400">Route-fill $99 — ops only, never public</li>
        </ul>
      </section>
    </div>
  );
}
