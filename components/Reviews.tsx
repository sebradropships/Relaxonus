"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { Stars } from "@/components/Rating";
import { REVIEWS_EMPTY, TIER_ORDER, VARIANTS, type VariantKey } from "@/lib/product";
import { getReviews, reviewStats, type Review } from "@/lib/reviews";

type Filter = "all" | "photos" | "5" | "4" | "3" | "2" | "1";

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  /* Fixed locale: the server and client must produce identical output or
     React reports a hydration mismatch. */
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ------------------------------- Review card ------------------------------ */

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="card flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <Stars value={review.rating} size={13} />
        <span className="num shrink-0 text-[12px] text-faint">{formatDate(review.date)}</span>
      </div>

      {review.title && (
        <figcaption className="mt-3 text-[15px] font-semibold leading-snug text-ink">
          {review.title}
        </figcaption>
      )}

      <blockquote className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">
        {review.text}
      </blockquote>

      {review.image && (
        <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-lg border border-line">
          <Image
            src={review.image.url}
            alt={review.image.alt}
            fill
            sizes="(max-width: 767px) 90vw, 340px"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line pt-3 text-[13px]">
        <span className="font-medium text-ink">{review.customerName}</span>
        {review.verifiedPurchase && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
            <svg width="10" height="10" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4.5 10.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Verified
          </span>
        )}
        <span className="text-faint">· {VARIANTS[review.variant].short}</span>
        {/* Named, never implied — a review written on another platform was not
            written by a customer of this store. */}
        {review.source && <span className="w-full text-faint">via {review.source}</span>}
      </div>
    </figure>
  );
}

/* ------------------------------ Distribution ------------------------------ */

function Distribution({
  distribution,
  count,
  active,
  onPick,
}: {
  distribution: number[];
  count: number;
  active: Filter;
  onPick: (filter: Filter) => void;
}) {
  return (
    <div className="mt-5 grid gap-1.5">
      {[5, 4, 3, 2, 1].map((star) => {
        const n = distribution[star - 1];
        const pct = count ? (n / count) * 100 : 0;
        const key = String(star) as Filter;
        const selected = active === key;

        return (
          <button
            key={star}
            type="button"
            onClick={() => onPick(selected ? "all" : key)}
            aria-pressed={selected}
            disabled={n === 0}
            className={`tap group flex items-center gap-3 rounded-lg px-2 text-left transition-colors disabled:cursor-default disabled:opacity-45 ${
              selected ? "bg-accent-soft" : "hover:bg-sand"
            }`}
          >
            <span className="num w-10 shrink-0 text-[13px] text-muted">{star} ★</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-line">
              <span
                className="block h-full rounded-full bg-accent transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </span>
            <span className="num w-7 shrink-0 text-right text-[13px] text-faint">{n}</span>
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------- Section -------------------------------- */

export function Reviews() {
  const reviews = getReviews();
  const stats = useMemo(() => reviewStats(reviews), [reviews]);

  const [filter, setFilter] = useState<Filter>("all");
  const [variant, setVariant] = useState<VariantKey | "all">("all");
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    return reviews.filter((review) => {
      if (variant !== "all" && review.variant !== variant) return false;
      if (filter === "photos") return Boolean(review.image);
      if (filter !== "all" && review.rating !== Number(filter)) return false;
      return true;
    });
  }, [reviews, filter, variant]);

  const shown = expanded ? filtered : filtered.slice(0, 6);

  /* Empty state. The only thing that ships until real reviews exist. */
  if (stats.count === 0) {
    return (
      <section id="reviews" className="sp-section border-t border-line py-16 sm:py-24">
        <div className="shell">
          <div className="card mx-auto max-w-3xl p-7 text-center sm:p-9">
            <h2 className="text-[length:var(--text-h2)] text-ink">{REVIEWS_EMPTY.heading}</h2>
            <p className="disclosure mx-auto mt-3 max-w-[62ch]">{REVIEWS_EMPTY.body}</p>
            <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-7 sm:grid-cols-4">
              {REVIEWS_EMPTY.proof.map(([value, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd>
                    <span className="display num block text-2xl text-ink">{value}</span>
                    <span className="mt-0.5 block text-[13px] leading-tight text-muted">{label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className="border-t border-line py-16 sm:py-24">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
          {/* Summary rail */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-[length:var(--text-h2)] text-ink">What people say</h2>

            <div className="mt-4 flex items-end gap-3">
              <span className="display num text-5xl leading-none text-ink">
                {stats.average.toFixed(1)}
              </span>
              <span className="pb-1">
                <Stars value={stats.average} size={16} />
                <span className="num mt-1 block text-[13px] text-muted">
                  {stats.count} {stats.count === 1 ? "review" : "reviews"}
                </span>
              </span>
            </div>

            <Distribution
              distribution={stats.distribution}
              count={stats.count}
              active={filter}
              onPick={setFilter}
            />

            <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
              <button
                type="button"
                onClick={() => setFilter(filter === "photos" ? "all" : "photos")}
                aria-pressed={filter === "photos"}
                disabled={stats.withPhotos === 0}
                className={`tap inline-flex items-center rounded-full border px-3 text-[13px] transition-colors disabled:opacity-45 ${
                  filter === "photos"
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line-strong text-muted hover:border-accent hover:text-accent"
                }`}
              >
                With photos ({stats.withPhotos})
              </button>
              {(filter !== "all" || variant !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setFilter("all");
                    setVariant("all");
                  }}
                  className="tap inline-flex items-center rounded-full px-3 text-[13px] text-muted underline underline-offset-4 hover:text-ink"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(["all", ...TIER_ORDER] as const).map((key) => {
                const selected = variant === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setVariant(key)}
                    aria-pressed={selected}
                    className={`tap inline-flex items-center rounded-full border px-3 text-[13px] transition-colors ${
                      selected
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-line text-muted hover:border-line-strong"
                    }`}
                  >
                    {key === "all" ? "All options" : VARIANTS[key].short}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards */}
          <div>
            <p aria-live="polite" className="sr-only">
              Showing {filtered.length} of {stats.count} reviews.
            </p>

            {filtered.length === 0 ? (
              <p className="card p-6 text-[15px] text-muted">
                No reviews match that filter yet.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {shown.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}

            {filtered.length > 6 && (
              <button
                type="button"
                onClick={() => setExpanded((open) => !open)}
                className="btn btn-quiet tap-lg mt-6 w-full px-6 py-3 text-sm"
              >
                {expanded ? "Show fewer" : `Show all ${filtered.length} reviews`}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
