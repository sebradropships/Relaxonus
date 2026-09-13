import { SHIPPING } from "@/lib/campaign";

/** Line truck, in the same one-weight stroke as the card icons in <Value>. */
export function TruckIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path d="M13.5 15.5v-9a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1H5" />
      <path d="M9.5 15.5h5" />
      <path d="M13.5 9h3.6a1 1 0 0 1 .8.4l2.9 3.7a1 1 0 0 1 .2.6v.8a1 1 0 0 1-1 1h-1.1" />
      <circle cx="7.25" cy="16" r="2.1" />
      <circle cx="16.75" cy="16" r="2.1" />
    </svg>
  );
}

/**
 * The free-shipping promise: truck and words in the accent.
 *
 * Renders nothing while SHIPPING.free is off, so no surface can go on making
 * the claim after the store stops honouring it.
 */
export function FreeShipping({
  label = SHIPPING.labels.full,
  iconSize = 18,
  className = "",
}: {
  label?: string;
  iconSize?: number;
  className?: string;
}) {
  if (!SHIPPING.free) return null;

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold text-accent ${className}`}>
      <TruckIcon size={iconSize} />
      {label}
    </span>
  );
}
