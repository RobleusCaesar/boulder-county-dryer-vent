"use client";

import { useEffect, useState } from "react";
import { getCrm } from "@/lib/crm";
import type { Job } from "@/lib/crm/types";

export default function PortalSchedulePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobId, setJobId] = useState("");
  const [preferredDates, setPreferredDates] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    getCrm()
      .getDemoCustomer()
      .then((customer) => getCrm().listJobs(customer.id))
      .then((list) => {
        setJobs(list);
        const upcoming = list.find((job) => job.status === "scheduled");
        setJobId(upcoming?.id || list[0]?.id || "");
      });
  }, []);

  return (
    <section className="site-wrap max-w-xl py-8">
      <h1 className="display text-3xl">Schedule</h1>
      <p className="mt-2 text-charcoal-600">
        Upcoming visits from the demo household. A reschedule request is stored locally in this stub — it does not move
        a real route.
      </p>
      <ul className="mt-6 space-y-2">
        {jobs
          .filter((job) => job.status === "scheduled" || job.status === "due")
          .map((job) => (
            <li key={job.id} className="card px-4 py-3 text-sm">
              <strong>{job.serviceDate}</strong> · {job.window} · {job.summary}
            </li>
          ))}
      </ul>
      <form
        className="card mt-6 space-y-4 p-6"
        onSubmit={async (event) => {
          event.preventDefault();
          const customer = await getCrm().getDemoCustomer();
          await getCrm().requestReschedule(customer.id, { jobId, preferredDates, note });
          setDone(true);
        }}
      >
        <h2 className="font-semibold">Reschedule request</h2>
        <label className="block">
          <span className="label">Job</span>
          <select className="field" value={jobId} onChange={(e) => setJobId(e.target.value)}>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.serviceDate} · {job.id}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">Preferred dates</span>
          <input className="field" value={preferredDates} onChange={(e) => setPreferredDates(e.target.value)} required />
        </label>
        <label className="block">
          <span className="label">Note</span>
          <textarea className="field min-h-24" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <button type="submit" className="btn-primary">
          {done ? "Request recorded" : "Send request"}
        </button>
        {done && <p className="text-sm text-teal-800">Saved in the mock CRM. Ops is not notified yet.</p>}
      </form>
    </section>
  );
}
