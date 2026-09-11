import { brand } from "@/lib/brand";

type PhonePlaceholderProps = {
  compact?: boolean;
  invert?: boolean;
};

export function PhonePlaceholder({ compact = false, invert = false }: PhonePlaceholderProps) {
  const tone = invert ? "text-white/80" : "text-charcoal-600";

  return (
    <p className={`${compact ? "text-xs" : "text-sm"} ${tone}`}>
      <span className={invert ? "text-white" : "font-semibold text-charcoal"}>{brand.phoneDisplay}</span>
    </p>
  );
}
