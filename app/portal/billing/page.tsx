"use client";

import { useEffect, useState } from "react";
import { getCrm } from "@/lib/crm";
import type { Invoice } from "@/lib/crm/types";
import { formatUsd } from "@/lib/pricing";

export default function PortalBillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    getCrm()
      .getDemoCustomer()
      .then((customer) => getCrm().listInvoices(customer.id))
      .then(setInvoices);
  }, []);

  return (
    <section className="site-wrap py-8">
      <h1 className="display text-3xl">Billing</h1>
      <p className="mt-2 text-charcoal-600">Demo invoices only. Payment collection is not connected.</p>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full card border-separate border-spacing-0 text-left text-sm">
          <thead className="bg-teal-50 text-xs uppercase tracking-wide text-charcoal-600">
            <tr>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Issued</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-t border-teal-900/10">
                <td className="px-4 py-3 font-semibold">{invoice.id}</td>
                <td className="px-4 py-3">{invoice.issuedOn}</td>
                <td className="px-4 py-3">{invoice.description}</td>
                <td className="px-4 py-3">{formatUsd(invoice.amount)}</td>
                <td className="px-4 py-3 capitalize">{invoice.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
