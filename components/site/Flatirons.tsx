export function Flatirons({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1200 280" fill="none" aria-hidden>
      <path
        d="M0 280 180 168l70 42 130-128 90 78 150-150 120 108 140-86 160 96 160-48V280H0Z"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="M0 280 210 190l80 28 140-110 70 62 160-120 110 88 130-70 180 80 119-36V280H0Z"
        fill="currentColor"
        opacity="0.12"
      />
    </svg>
  );
}
