import { neon } from "@neondatabase/serverless";

/**
 * Server-only handle to the team's database (Neon serverless Postgres over HTTP).
 * The connection string comes from `DATABASE_URL`, which the owner connects via
 * the database card and which is injected into the sandbox and passed to the live
 * host on publish. Resolved lazily (per call, not at module load) so the site
 * still builds and serves before a database is connected — the error only
 * surfaces if a query actually runs without `DATABASE_URL`.
 *
 * Use it only inside a `createServerFn()` handler or an `src/routes/api/*` route
 * (never client code):
 *
 *   const getPosts = createServerFn().handler(async () => {
 *     const rows = await sql()`select id, title, created_at from posts`;
 *     // Coerce non-primitive columns (timestamps are JS Dates) to strings before
 *     // returning to the client, or React will refuse to render them:
 *     return rows.map((r) => ({ ...r, created_at: String(r.created_at) }));
 *   });
 */
export const sql = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set — connect a database (via the database card) before running queries.",
    );
  }
  return neon(url);
};

// ---------------------------------------------------------------------------
// Resilient reads (added 2026-09-19)
//
// Neon is reached over HTTPS, one request per query, so a single transient
// failure (cold compute, a brief network blip, a burst of concurrent page
// requests) used to throw straight out of a route loader. TanStack's default
// error boundary then replaced the whole page body with a tiny "Something went
// wrong!" widget — a sales page with no content, no price and no buy button,
// which is what JVZoo compliance kept seeing ("page incomplete / missing text /
// missing buy button"). Two changes fix that:
//
//   1. reads are retried a few times with a short backoff, so transient
//      failures never reach the renderer at all, and
//   2. if every attempt fails, callers get a DbUnavailableError they must turn
//      into visible fallback UI (see components/ContentUnavailable.tsx) — never
//      an empty page.
//
// Only use this for reads. Writes (lead capture) must not be retried blindly,
// because a retry after a half-failed write could duplicate a row.
const MAX_ATTEMPTS = 3;
const BASE_BACKOFF_MS = 250;

/** Thrown when a read still fails after every retry. Render fallback UI, don't swallow it. */
export class DbUnavailableError extends Error {
  readonly label: string;
  constructor(label: string, cause: unknown) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    super(
      `Database read "${label}" failed after ${String(MAX_ATTEMPTS)} attempts: ${detail}`,
    );
    this.name = "DbUnavailableError";
    this.label = label;
  }
}

/**
 * Run a read against Neon with bounded retries.
 *
 *   const rows = await readWithRetry("library.pack", (db) =>
 *     db`select ... from content_packs where slug = ${slug}`);
 *
 * Writes up-front so the failure is visible in the server log, and throws a
 * DbUnavailableError once the retries are exhausted so the route can render an
 * honest "temporarily unavailable" block instead of a contentless page.
 */
export async function readWithRetry<T>(
  label: string,
  run: (db: ReturnType<typeof sql>) => Promise<T>,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await run(sql());
    } catch (err) {
      lastError = err;
      console.error(
        `[db] read "${label}" failed (attempt ${String(attempt)}/${String(MAX_ATTEMPTS)}):`,
        err instanceof Error ? err.message : err,
      );
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) =>
          setTimeout(resolve, BASE_BACKOFF_MS * attempt),
        );
      }
    }
  }
  throw new DbUnavailableError(label, lastError);
}
