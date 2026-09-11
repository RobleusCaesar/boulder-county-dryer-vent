import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata: Metadata = {
  title: "Dryer vent cleaning",
  description: "How a Boulder County Dryer Vent visit works, what we clean, and what we won’t pretend to do.",
};

const steps = [
  {
    title: "We start at the dryer",
    body: "The machine is pulled far enough to disconnect the transition. If the box is boxed in, say so during booking so we can plan the visit.",
  },
  {
    title: "The run gets brushed",
    body: "We rod and brush the line toward the termination. Flexible foil in walls is a problem we will name, not a surprise invoice.",
  },
  {
    title: "The cap has to work",
    body: "A clean pipe with a stuck flap still cooks the dryer. We clear the termination and confirm the flap moves.",
  },
  {
    title: "You get a plain note",
    body: "Length estimate, anything we couldn’t reach, and when the next clean should be. Photos land in the portal once storage is live.",
  },
];

export default function ServicePage() {
  return (
    <>
      <PageHero
        kicker="The service"
        title="Dryer vent cleaning, done as a visit — not a mystery estimate"
        lede="Most Boulder County homes need a yearly clean. Some need it sooner. We price the work from stories and access, then show up with brushes, not a renegotiation."
      />
      <section className="site-wrap grid gap-6 py-12 md:grid-cols-2">
        {steps.map((step) => (
          <article key={step.title} className="card p-6">
            <h2 className="text-xl font-semibold">{step.title}</h2>
            <p className="mt-2 text-charcoal-600">{step.body}</p>
          </article>
        ))}
      </section>
      <section className="site-wrap pb-8">
        <div className="card grid gap-8 p-6 md:grid-cols-2 md:p-8">
          <div>
            <h2 className="display text-2xl">What this visit is</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-charcoal-800">
              <li>Residential dryer-to-termination cleaning</li>
              <li>Termination flap check</li>
              <li>A written note you can keep</li>
            </ul>
          </div>
          <div>
            <h2 className="display text-2xl">What it is not</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-charcoal-800">
              <li>New duct installs or dryer repairs</li>
              <li>Commercial laundry or multi-unit risers booked online</li>
              <li>A guarantee that a crushed or disconnected run can be fully cleaned from one end</li>
            </ul>
          </div>
        </div>
      </section>
      <CtaBand title="If the vent is due, start with the price." />
    </>
  );
}
