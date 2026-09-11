"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { inAreaCities, inAreaZips, serviceAreas } from "@/lib/areas";
import { BOOKING_STORAGE_KEY, CONFIRMATION_STORAGE_KEY, emptyDraft, type BookingDraft } from "@/lib/booking/store";
import { getCrm } from "@/lib/crm";
import { formatUsd, prices, quoteFromEligibility } from "@/lib/pricing";
import { routes } from "@/lib/routes";

const steps = ["Eligibility", "Price", "Times", "Details", "Pay"] as const;

function readOfferFlag() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("offer") === "route";
}

export function BookingWizard() {
  const router = useRouter();
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem(BOOKING_STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as BookingDraft) : emptyDraft;
    setDraft({
      ...emptyDraft,
      ...parsed,
      routeFill: parsed.routeFill || readOfferFlag(),
    });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(draft));
  }, [draft, ready]);

  const step = draft.step ?? 0;
  const quote = useMemo(
    () =>
      quoteFromEligibility({
        stories: draft.stories === "2+" ? "2+" : "1",
        roofAccess: Boolean(draft.roofAccess),
        routeFill: Boolean(draft.routeFill),
      }),
    [draft.stories, draft.roofAccess, draft.routeFill],
  );

  const inArea = draft.zip ? inAreaZips.has(draft.zip) || inAreaCities.includes(draft.city || "") : true;
  const commercial = draft.propertyType === "commercial";
  const blocked = Boolean(draft.zip) && (!inArea || commercial);

  function patch(next: Partial<BookingDraft>) {
    setDraft((current) => ({ ...current, ...next }));
    setError("");
  }

  function go(nextStep: number) {
    patch({ step: nextStep, priceId: quote.price.id, amount: quote.price.amount });
  }

  async function finish() {
    if (!draft.firstName || !draft.lastName || !draft.email || !draft.phone || !draft.addressLine1 || !draft.zip) {
      setError("Fill in name, email, phone, street, and ZIP.");
      return;
    }
    setSubmitting(true);
    try {
      const crm = getCrm();
      const result = await crm.submitBooking({
        city: draft.city || "",
        zip: draft.zip || "",
        propertyType: draft.propertyType || "house",
        stories: draft.stories || "1",
        roofAccess: Boolean(draft.roofAccess),
        routeFill: Boolean(draft.routeFill),
        priceId: quote.price.id,
        amount: quote.price.amount,
        waitlist: true,
        firstName: draft.firstName,
        lastName: draft.lastName,
        email: draft.email,
        phone: draft.phone,
        addressLine1: draft.addressLine1,
        smsConsent: Boolean(draft.smsConsent),
        notes: draft.notes || "",
      });
      sessionStorage.setItem(
        CONFIRMATION_STORAGE_KEY,
        JSON.stringify({
          confirmationId: result.confirmationId,
          amount: quote.price.amount,
          priceLabel: quote.price.label,
          waitlist: true,
        }),
      );
      sessionStorage.removeItem(BOOKING_STORAGE_KEY);
      router.push(routes.bookConfirmation);
    } catch {
      setError("Could not save the request. Try again.");
      setSubmitting(false);
    }
  }

  if (!ready) {
    return <div className="card p-8 text-charcoal-400">Loading the booking form…</div>;
  }

  return (
    <div className="card overflow-hidden">
      <ol className="grid grid-cols-5 border-b border-teal-900/10 bg-teal-50/60 text-center text-[0.7rem] font-semibold uppercase tracking-wide text-charcoal-600 sm:text-xs">
        {steps.map((label, index) => (
          <li
            key={label}
            className={`px-1 py-3 ${index === step ? "bg-teal-800 text-white" : index < step ? "text-teal-800" : ""}`}
          >
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{index + 1}</span>
          </li>
        ))}
      </ol>

      <div className="space-y-6 p-5 sm:p-8">
        {step === 0 && (
          <div className="space-y-4">
            <h1 className="display text-3xl">Can we book this house?</h1>
            <p className="text-charcoal-600">A few facts set the price and tell us if you’re in the service area.</p>
            <label className="block">
              <span className="label">City</span>
              <select className="field" value={draft.city} onChange={(e) => patch({ city: e.target.value })}>
                <option value="">Select a city</option>
                {serviceAreas.map((area) => (
                  <option key={area.slug} value={area.city}>
                    {area.city}, CO
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </label>
            <label className="block">
              <span className="label">ZIP</span>
              <input
                className="field"
                inputMode="numeric"
                maxLength={5}
                value={draft.zip}
                onChange={(e) => patch({ zip: e.target.value.replace(/\D/g, "").slice(0, 5) })}
              />
            </label>
            <fieldset className="space-y-2">
              <legend className="label">Property</legend>
              {(["house", "townhome", "condo", "commercial"] as const).map((type) => (
                <label key={type} className="flex items-center gap-2 text-sm capitalize">
                  <input
                    type="radio"
                    name="propertyType"
                    checked={draft.propertyType === type}
                    onChange={() => patch({ propertyType: type })}
                  />
                  {type}
                </label>
              ))}
            </fieldset>
            <fieldset className="space-y-2">
              <legend className="label">Stories</legend>
              {(["1", "2+"] as const).map((stories) => (
                <label key={stories} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="stories"
                    checked={draft.stories === stories}
                    onChange={() => patch({ stories })}
                  />
                  {stories === "1" ? "One story" : "Two or more"}
                </label>
              ))}
            </fieldset>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={Boolean(draft.roofAccess)}
                onChange={(e) => patch({ roofAccess: e.target.checked })}
              />
              The termination is on the roof or needs a ladder set-up.
            </label>
            {blocked && (
              <p className="rounded-xl bg-cream px-4 py-3 text-sm">
                {commercial
                  ? "Commercial plants are not booked online. Leave a note on the contact page."
                  : "That ZIP is outside the towns we publish. You can still join the waitlist on the next steps if you want to be notified later."}
              </p>
            )}
            <button
              type="button"
              className="btn-primary"
              disabled={!draft.city || (draft.zip || "").length < 5}
              onClick={() => go(1)}
            >
              See price
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h1 className="display text-3xl">Your visit price</h1>
            <div className="rounded-2xl bg-teal-900 px-5 py-6 text-white">
              <p className="text-sm text-teal-100">{quote.price.label}</p>
              <p className="display text-5xl">{formatUsd(quote.price.amount)}</p>
              <p className="mt-2 text-white/75">{quote.reason}</p>
            </div>
            {draft.routeFill && (
              <p className="text-sm text-teal-800">
                Route-fill rate is on because this link included a leftover-capacity offer.
              </p>
            )}
            <p className="text-sm text-charcoal-600">
              Annual plan after the first visit: {formatUsd(prices.annual.amount)} / year. You can ask for it in the
              notes on the details step.
            </p>
            <div className="flex gap-3">
              <button type="button" className="btn-ghost" onClick={() => go(0)}>
                Back
              </button>
              <button type="button" className="btn-primary" onClick={() => go(2)}>
                Check times
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <TimesStep
            onBack={() => go(1)}
            onContinue={() => go(3)}
            onWaitlist={async (entry) => {
              await getCrm().submitWaitlist(entry);
              patch({ waitlist: true });
              go(3);
            }}
            zip={draft.zip || ""}
          />
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h1 className="display text-3xl">Your details</h1>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="label">First name</span>
                <input className="field" value={draft.firstName || ""} onChange={(e) => patch({ firstName: e.target.value })} />
              </label>
              <label className="block">
                <span className="label">Last name</span>
                <input className="field" value={draft.lastName || ""} onChange={(e) => patch({ lastName: e.target.value })} />
              </label>
            </div>
            <label className="block">
              <span className="label">Email</span>
              <input className="field" type="email" value={draft.email || ""} onChange={(e) => patch({ email: e.target.value })} />
            </label>
            <label className="block">
              <span className="label">Phone</span>
              <input className="field" type="tel" value={draft.phone || ""} onChange={(e) => patch({ phone: e.target.value })} />
            </label>
            <label className="block">
              <span className="label">Street address</span>
              <input
                className="field"
                value={draft.addressLine1 || ""}
                onChange={(e) => patch({ addressLine1: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="label">Notes (gate codes, dryer location, annual plan)</span>
              <textarea className="field min-h-28" value={draft.notes || ""} onChange={(e) => patch({ notes: e.target.value })} />
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={Boolean(draft.smsConsent)}
                onChange={(e) => patch({ smsConsent: e.target.checked })}
              />
              I agree to receive appointment texts from Boulder County Dryer Vent. Frequency varies. Msg & data rates may
              apply. Reply STOP to opt out. Consent is not required to book.
            </label>
            <div className="flex gap-3">
              <button type="button" className="btn-ghost" onClick={() => go(2)}>
                Back
              </button>
              <button type="button" className="btn-primary" onClick={() => go(4)}>
                Continue to pay
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h1 className="display text-3xl">Payment</h1>
            <p className="rounded-2xl bg-cream px-4 py-3 text-sm">
              Card checkout is not live. Submitting records a booking request in this demo and does not charge a card.
            </p>
            {/* TODO(stripe): replace this stub with Stripe Payment Element once the CRM writes a booking. */}
            <div className="grid gap-3 rounded-2xl border border-dashed border-charcoal/20 p-4">
              <label className="block">
                <span className="label">Card number</span>
                <input className="field" placeholder="Not accepted yet" disabled />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input className="field" placeholder="MM / YY" disabled />
                <input className="field" placeholder="CVC" disabled />
              </div>
            </div>
            <p className="text-sm text-charcoal-600">
              Due if we confirm: <strong>{formatUsd(quote.price.amount)}</strong> · {quote.price.label}
            </p>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" className="btn-ghost" onClick={() => go(3)}>
                Back
              </button>
              <button type="button" className="btn-primary" disabled={submitting} onClick={finish}>
                {submitting ? "Saving…" : "Submit request"}
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-charcoal-400">
          Need a person instead?{" "}
          <Link href={routes.contact} className="underline">
            Contact
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function TimesStep({
  onBack,
  onContinue,
  onWaitlist,
  zip,
}: {
  onBack: () => void;
  onContinue: () => void;
  onWaitlist: (entry: { name: string; email: string; phone: string; zip: string; preferredDays: string; note: string }) => Promise<void>;
  zip: string;
}) {
  const [slots, setSlots] = useState<Array<{ id: string; start: string; end: string }> | null>(null);
  const [joined, setJoined] = useState(false);
  const [wait, setWait] = useState({ name: "", email: "", phone: "", preferredDays: "", note: "" });

  useEffect(() => {
    getCrm()
      .listSlots()
      .then(setSlots);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="display text-3xl">Appointment times</h1>
      {slots === null && <p className="text-charcoal-400">Checking the book…</p>}
      {slots && slots.length === 0 && (
        <div className="rounded-2xl border border-teal-900/10 bg-teal-50/80 p-5">
          <p className="font-semibold text-teal-950">No times open yet — join waitlist / leave contact</p>
        </div>
      )}
      {slots && slots.length > 0 && (
        <ul className="space-y-2">
          {slots.map((slot) => (
            <li key={slot.id} className="card px-4 py-3 text-sm">
              {slot.start} – {slot.end}
            </li>
          ))}
        </ul>
      )}

      <form
        className="space-y-3"
        onSubmit={async (event) => {
          event.preventDefault();
          await onWaitlist({ ...wait, zip });
          setJoined(true);
        }}
      >
        <h2 className="font-semibold">Waitlist</h2>
        <input className="field" placeholder="Name" required value={wait.name} onChange={(e) => setWait({ ...wait, name: e.target.value })} />
        <input className="field" type="email" placeholder="Email" required value={wait.email} onChange={(e) => setWait({ ...wait, email: e.target.value })} />
        <input className="field" type="tel" placeholder="Phone" required value={wait.phone} onChange={(e) => setWait({ ...wait, phone: e.target.value })} />
        <input
          className="field"
          placeholder="Preferred days (e.g. Tue / Thu mornings)"
          value={wait.preferredDays}
          onChange={(e) => setWait({ ...wait, preferredDays: e.target.value })}
        />
        <textarea className="field min-h-20" placeholder="Anything else" value={wait.note} onChange={(e) => setWait({ ...wait, note: e.target.value })} />
        <button type="submit" className="btn-primary">
          {joined ? "Waitlist saved" : "Join waitlist"}
        </button>
      </form>
      <div className="flex gap-3">
        <button type="button" className="btn-ghost" onClick={onBack}>
          Back
        </button>
        <button type="button" className="btn-ghost" onClick={onContinue}>
          Continue to details
        </button>
      </div>
    </div>
  );
}
