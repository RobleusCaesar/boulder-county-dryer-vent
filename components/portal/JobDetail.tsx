"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCrm } from "@/lib/crm";
import type { Job } from "@/lib/crm/types";
import { formatUsd } from "@/lib/pricing";
import { routes } from "@/lib/routes";

export function JobDetail({ id }: { id: string }) {
  const [job, setJob] = useState<Job | null | undefined>(undefined);

  useEffect(() => {
    getCrm()
      .getJob(id)
      .then(setJob);
  }, [id]);

  if (job === undefined) {
    return <div className="site-wrap py-12 text-charcoal-400">Loading job…</div>;
  }

  if (!job) {
    return (
      <section className="site-wrap py-12">
        <h1 className="display text-3xl">Job not in the demo set</h1>
        <Link href={routes.portal.jobs} className="btn-ghost mt-4">
          All jobs
        </Link>
      </section>
    );
  }

  return (
    <section className="site-wrap max-w-3xl space-y-4 py-8">
      <p className="kicker">Job {job.id}</p>
      <h1 className="display text-3xl">{job.summary}</h1>
      <div className="card grid gap-4 p-6 sm:grid-cols-2">
        <p>
          <span className="block text-xs uppercase tracking-wide text-charcoal-400">Date</span>
          {job.serviceDate} {job.window}
        </p>
        <p>
          <span className="block text-xs uppercase tracking-wide text-charcoal-400">Status</span>
          <span className="capitalize">{job.status}</span>
        </p>
        <p>
          <span className="block text-xs uppercase tracking-wide text-charcoal-400">Amount</span>
          {formatUsd(job.amount)}
        </p>
      </div>
      <article className="card p-6">
        <h2 className="font-semibold">Tech notes</h2>
        <p className="mt-2 text-charcoal-600">{job.techNotes || "No tech notes yet."}</p>
      </article>
      <article className="card p-6">
        <h2 className="font-semibold">Your notes</h2>
        <p className="mt-2 text-charcoal-600">{job.customerNotes || "None"}</p>
      </article>
      <article className="card p-6">
        <h2 className="font-semibold">Photos</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {(job.photos.length ? job.photos : [{ id: "empty", caption: "No photos yet", kind: "issue" as const, placeholder: true }]).map(
            (photo) => (
              <div key={photo.id} className="aspect-[4/3] rounded-xl border border-dashed border-charcoal/20 bg-cream p-3">
                <p className="text-xs uppercase tracking-wide text-charcoal-400">{photo.kind}</p>
                <p className="mt-6 text-sm font-semibold">{photo.caption}</p>
                <p className="mt-1 text-xs text-charcoal-400">Placeholder — storage not connected</p>
              </div>
            ),
          )}
        </div>
      </article>
      <Link href={routes.portal.schedule} className="btn-primary">
        Request a reschedule
      </Link>
    </section>
  );
}
