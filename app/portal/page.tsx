"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { brand } from "@/lib/brand";
import { getCrm } from "@/lib/crm";
import type { Customer, Invoice, Job } from "@/lib/crm/types";
import { formatUsd } from "@/lib/pricing";
import { routes } from "@/lib/routes";

export default function PortalHomePage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [next, setNext] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const crm = getCrm();
    crm.getDemoCustomer().then(async (person) => {
      setCustomer(person);
      const [upcoming, history, bills] = await Promise.all([
        crm.nextClean(person.id),
        crm.listJobs(person.id),
        crm.listInvoices(person.id),
      ]);
      setNext(upcoming);
      setJobs(history);
      setInvoices(bills);
    });
  }, []);

  if (!customer) {
    return <div className="site-wrap py-12 text-charcoal-400">Loading demo household…</div>;
  }

  return (
    <section className="site-wrap grid gap-4 py-8 lg:grid-cols-3">
      <article className="card p-6 lg:col-span-2">
        <p className="kicker">Household</p>
        <h1 className="display mt-1 text-3xl">
          {customer.firstName} {customer.lastName}
        </h1>
        <p className="mt-2 text-charcoal-600">
          {customer.addressLine1}, {customer.city}, {customer.state} {customer.zip}
        </p>
        <p className="mt-4 rounded-xl bg-cream px-4 py-3 text-sm">{customer.notes}</p>
      </article>
      <article className="card p-6">
        <p className="kicker">Company</p>
        <p className="mt-2 font-semibold">{brand.name}</p>
        <p className="mt-1 text-sm text-charcoal-600">{brand.addressLine}</p>
        <p className="mt-2 text-sm text-charcoal-600">{brand.hours}</p>
      </article>
      <article className="card p-6">
        <p className="kicker">Next clean</p>
        {next ? (
          <>
            <p className="mt-2 text-xl font-semibold">{next.serviceDate}</p>
            <p className="text-sm text-charcoal-600">{next.window}</p>
            <p className="mt-2 text-sm">{next.summary}</p>
            <Link href={routes.portal.job(next.id)} className="mt-4 inline-block font-semibold text-teal-700">
              View job →
            </Link>
          </>
        ) : (
          <p className="mt-2 text-charcoal-600">No upcoming visit on file.</p>
        )}
      </article>
      <article className="card p-6">
        <p className="kicker">History</p>
        <ul className="mt-3 space-y-2 text-sm">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link href={routes.portal.job(job.id)} className="font-semibold text-teal-800">
                {job.serviceDate || "Undated"} · {job.status}
              </Link>
            </li>
          ))}
        </ul>
      </article>
      <article className="card p-6">
        <p className="kicker">Invoices</p>
        <ul className="mt-3 space-y-2 text-sm">
          {invoices.map((invoice) => (
            <li key={invoice.id} className="flex justify-between gap-3">
              <span>{invoice.description}</span>
              <span>
                {formatUsd(invoice.amount)} · {invoice.status}
              </span>
            </li>
          ))}
        </ul>
        <Link href={routes.portal.billing} className="mt-4 inline-block font-semibold text-teal-700">
          Billing →
        </Link>
      </article>
      <article className="card p-6">
        <p className="kicker">SMS</p>
        <p className="mt-2 text-sm text-charcoal-600">
          Consent is {customer.smsConsent ? "on" : "off"}. Change it in account.
        </p>
        <Link href={routes.portal.account} className="mt-4 inline-block font-semibold text-teal-700">
          Account →
        </Link>
      </article>
    </section>
  );
}
