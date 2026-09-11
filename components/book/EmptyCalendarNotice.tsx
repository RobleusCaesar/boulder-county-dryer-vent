export function EmptyCalendarNotice() {
  return (
    <div className="rounded-2xl border border-teal-900/10 bg-teal-50/80 p-5">
      <p className="font-semibold text-teal-950">No times open yet — join waitlist / leave contact</p>
      <p className="mt-2 text-sm text-charcoal-600">
        The calendar is empty on purpose. We will not show placeholder slots.
      </p>
    </div>
  );
}
