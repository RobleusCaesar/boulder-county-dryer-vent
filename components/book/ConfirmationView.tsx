"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONFIRMATION_STORAGE_KEY } from "@/lib/booking/store";
import { formatUsd } from "@/lib/pricing";
import { routes } from "@/lib/routes";

type Confirmation = {
  confirmationId: string;
  amount: number;
  priceLabel: string;
  waitlist: boolean;
};

export function ConfirmationView() {
  const [data, setData] = useState<Confirmation | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(CONFIRMATION_STORAGE_KEY);
    if (raw) setData(JSON.parse(raw) as Confirmation);
  }, []);

  return (
    <div className="card p-6 sm:p-8">
      <p className="kicker">Request received</p>
      <h1 className="display mt-2 text-4xl">You’re on the list</h1>
      <p className="mt-4 text-lg text-charcoal-600">
        Nothing was charged. When a real opening matches this request, we’ll email you. If you joined the waitlist,
        that is the source of truth until the public calendar has times.
      </p>
      {data && (
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-cream px-4 py-3">
            <dt className="text-charcoal-400">Confirmation</dt>
            <dd className="font-semibold">{data.confirmationId}</dd>
          </div>
          <div className="rounded-xl bg-cream px-4 py-3">
            <dt className="text-charcoal-400">Quoted</dt>
            <dd className="font-semibold">
              {formatUsd(data.amount)} · {data.priceLabel}
            </dd>
          </div>
        </dl>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href={routes.home} className="btn-primary">
          Back home
        </Link>
        <Link href={routes.portal.login} className="btn-ghost">
          Open demo portal
        </Link>
      </div>
    </div>
  );
}
