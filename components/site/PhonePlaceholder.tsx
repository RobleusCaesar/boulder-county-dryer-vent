import { brand } from "@/lib/brand";

type PhonePlaceholderProps = {
  compact?: boolean;
  invert?: boolean;
};

export function PhonePlaceholder({ compact = false, invert = false }: PhonePlaceholderProps) {
  const tone = invert ? "text-white/80" : "text-charcoal-600";

  return (
    <p className={`text-sm ${tone}`}>
      <span className={invert ? "text-white" : "font-semibold text-charcoal"}>{brand.phoneDisplay}</span>
      {brand.phoneIsPlaceholder && !compact && <span className="ml-1 text-xs opacity-70">placeholder</span>}
    </p>
  );
}
