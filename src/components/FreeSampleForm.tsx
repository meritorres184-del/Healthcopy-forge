import { useState } from "react";
import { submitFreeSample } from "../lib/freeSample";

export interface PackOption {
  slug: string;
  title: string;
}

export const SUCCESS_MESSAGE =
  "Check your inbox — your sample article is on its way.";

/**
 * Shown when the address could NOT be added to the list (MailerLite down, key
 * rejected, API error, or not configured). It must stay honest: no promise of
 * an email, because no subscriber was created.
 */
export const FAILURE_MESSAGE =
  "We couldn't add you to our list just now. Please try again in a moment.";

export type FreeSampleOutcome = {
  status: "success" | "error";
  message: string;
};

/**
 * Map the server result to what the visitor sees. `subscribed` is the ONLY
 * thing that decides it: the server returns `subscribed: false` whenever
 * forwarding failed, so a failed lead can never be shown the success message.
 */
export function outcomeFor(result: { subscribed?: boolean }): FreeSampleOutcome {
  return result.subscribed === true
    ? { status: "success", message: SUCCESS_MESSAGE }
    : { status: "error", message: FAILURE_MESSAGE };
}

export interface FreeSampleSubmitData {
  name: string;
  email: string;
  packSlug: string;
}

/**
 * Run the submit and decide what the visitor sees — the one place the form's
 * outcome comes from. Exported so the failure path is testable without a DOM
 * (the submit function is injectable: the real server fn, or a stub).
 */
export async function submitOutcome(
  submit: (data: FreeSampleSubmitData) => Promise<{ subscribed?: boolean }>,
  data: FreeSampleSubmitData,
): Promise<FreeSampleOutcome> {
  return outcomeFor(await submit(data));
}

export function FreeSampleForm({ packs }: { packs: PackOption[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [packSlug, setPackSlug] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setError("");
    try {
      const outcome = await submitOutcome(
        (payload) => submitFreeSample({ data: payload }),
        { name, email, packSlug },
      );
      setStatus(outcome.status);
      setError(outcome.status === "error" ? outcome.message : "");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong — please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="rounded-xl bg-emerald-50 px-6 py-5 text-center text-base font-semibold text-emerald-700"
      >
        {SUCCESS_MESSAGE}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          autoComplete="name"
          className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-base text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 sm:flex-1"
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-base text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 sm:flex-1"
        />
      </div>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <select
          name="packSlug"
          value={packSlug}
          onChange={(e) => setPackSlug(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-base text-gray-700 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 sm:flex-1"
        >
          <option value="">Any pack</option>
          {packs.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 disabled:opacity-60 sm:w-auto"
        >
          {status === "loading" ? "Sending…" : "Get My Free Sample"}
        </button>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}

export function FreeSampleBand({
  packs,
  packsDegraded,
}: {
  packs: PackOption[];
  /** True when the pack list could not be read — say so, don't just show an empty dropdown. */
  packsDegraded?: boolean;
}) {
  return (
    <section id="free-sample" className="border-y border-emerald-100 bg-emerald-50 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
          Free Sample
        </span>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Free Sample Article — See the quality before you buy
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-gray-600">
          Get one full SEO-written article from the library, free. See the
          research, formatting, and ready-to-brand quality for yourself — then
          decide which pack fits your business.
        </p>
        <div className="mt-8">
          <FreeSampleForm packs={packs} />
        </div>
        {packsDegraded ? (
          <p className="mx-auto mt-4 max-w-xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
            The per-pack list didn&apos;t load just now, so the picker shows
            &ldquo;Any pack&rdquo; only. Your request still works — reload the
            page for the full list.
          </p>
        ) : null}
        <p className="mt-4 text-xs text-gray-400">
          One sample per email. No spam — unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
