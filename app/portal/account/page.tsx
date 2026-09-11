"use client";

import { useEffect, useState } from "react";
import { getCrm } from "@/lib/crm";
import type { Customer } from "@/lib/crm/types";

export default function PortalAccountPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getCrm().getDemoCustomer().then(setCustomer);
  }, []);

  if (!customer) {
    return <div className="site-wrap py-12 text-charcoal-400">Loading account…</div>;
  }

  return (
    <section className="site-wrap max-w-xl py-8">
      <h1 className="display text-3xl">Account</h1>
      <dl className="card mt-6 space-y-3 p-6 text-sm">
        <div>
          <dt className="text-charcoal-400">Name</dt>
          <dd className="font-semibold">
            {customer.firstName} {customer.lastName}
          </dd>
        </div>
        <div>
          <dt className="text-charcoal-400">Email</dt>
          <dd>{customer.email}</dd>
        </div>
        <div>
          <dt className="text-charcoal-400">Phone</dt>
          <dd>{customer.phone}</dd>
        </div>
        <div>
          <dt className="text-charcoal-400">Service address</dt>
          <dd>
            {customer.addressLine1}, {customer.city}, {customer.state} {customer.zip}
          </dd>
        </div>
      </dl>
      <form
        className="card mt-4 p-6"
        onSubmit={async (event) => {
          event.preventDefault();
          const next = await getCrm().updateSmsConsent(customer.id, customer.smsConsent);
          setCustomer(next);
          setSaved(true);
        }}
      >
        <h2 className="font-semibold">SMS consent</h2>
        <label className="mt-3 flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={customer.smsConsent}
            onChange={(e) => setCustomer({ ...customer, smsConsent: e.target.checked })}
          />
          Send me appointment texts. Frequency varies. Msg & data rates may apply. Reply STOP to opt out. Consent is not
          required to keep service.
        </label>
        <button type="submit" className="btn-primary mt-4">
          Save consent
        </button>
        {saved && <p className="mt-2 text-sm text-teal-800">Updated on the mock customer.</p>}
      </form>
    </section>
  );
}
