"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCrm } from "@/lib/crm";
import type { Job } from "@/lib/crm/types";
import { formatUsd } from "@/lib/pricing";
import { routes } from "@/lib/routes";

export default function PortalJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    getCrm()
      .getDemoCustomer()
      .then((customer) => getCrm().listJobs(customer.id))
      .then(setJobs);
  }, []);

  return (
    <section className="site-wrap py-8">
      <h1 className="display text-3xl">Jobs</h1>
      <ul className="mt-6 space-y-3">
        {jobs.map((job) => (
          <li key={job.id}>
            <Link href={routes.portal.job(job.id)} className="card block p-5 hover:shadow-lift">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">
                  {job.serviceDate || "Date TBA"} · {job.window || "window TBA"}
                </p>
                <p className="text-sm capitalize text-teal-800">{job.status}</p>
              </div>
              <p className="mt-2 text-sm text-charcoal-600">{job.summary}</p>
              <p className="mt-2 text-sm">{formatUsd(job.amount)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
