import { brand } from "@/lib/brand";

type PhonePlaceholderProps = {
  compact?: boolean;
  invert?: boolean;
};

export function PhonePlaceholder({ compact = false, invert = false }: PhonePlaceholderProps) {
  const tone = invert ? "text-white/80" : "text-charcoal-600";
  const labelClass = invert ? "text-white" : "font-semibold text-charcoal";

  if (brand.phoneHref) {
    return (
      <p className={`${compact ? "text-xs" : "text-sm"} ${tone}`}>
        <a href={brand.phoneHref} className={`${labelClass} hover:underline`}>
          {brand.phoneDisplay}
        </a>
      </p>
    );
  }

  return (
    <p className={`${compact ? "text-xs" : "text-sm"} ${tone}`}>
      <span className={labelClass}>{brand.phoneDisplay}</span>
    </p>
  );
}
