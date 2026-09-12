import { useState } from "react";
import { submitFreeSample } from "../lib/freeSample";

export interface PackOption {
  slug: string;
  title: string;
}

const SUCCESS_MESSAGE = "Check your inbox — your sample article is on its way.";

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
      await submitFreeSample({ data: { name, email, packSlug } });
      setStatus("success");
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

export function FreeSampleBand({ packs }: { packs: PackOption[] }) {
  return (
    <section className="border-y border-emerald-100 bg-emerald-50 px-4 py-16 sm:px-6 sm:py-20">
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
        <p className="mt-4 text-xs text-gray-400">
          One sample per email. No spam — unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
