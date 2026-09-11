"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getCrm } from "@/lib/crm";
import { DEMO_PORTAL_HINT, PORTAL_SESSION_KEY } from "@/lib/portal/session";
import { routes } from "@/lib/routes";

export default function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("jordan.hale@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function enterDemo() {
    const customer = await getCrm().getDemoCustomer();
    localStorage.setItem(
      PORTAL_SESSION_KEY,
      JSON.stringify({ demo: true, customerId: customer.id, email: customer.email }),
    );
    router.push(routes.portal.home);
  }

  return (
    <section className="site-wrap max-w-md py-12">
      <div className="card p-6 sm:p-8">
        <h1 className="display text-3xl">Customer portal</h1>
        <p className="mt-2 text-sm text-charcoal-600">{DEMO_PORTAL_HINT}</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            if (password !== "demo") {
              setError("For this stub, the password is demo.");
              return;
            }
            await enterDemo();
          }}
        >
          <label className="block">
            <span className="label">Email</span>
            <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="block">
            <span className="label">Password</span>
            <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            Sign in
          </button>
        </form>
        <button type="button" className="btn-ghost mt-3 w-full" onClick={enterDemo}>
          Enter demo portal
        </button>
        <p className="mt-4 text-xs text-charcoal-400">
          TODO(supabase): replace with magic-link or OTP against the customers table.
        </p>
      </div>
    </section>
  );
}
