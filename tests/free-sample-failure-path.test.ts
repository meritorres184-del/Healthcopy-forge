/**
 * Failure-path tests for the free-sample opt-in.
 *
 * Bug being locked down: the form discarded the `subscribed` flag and the server
 * swallowed MailerLite errors, so a visitor whose address was never added still
 * got the green "Check your inbox" message. These tests drive the real
 * `handleFreeSample` handler through the component's real submit pipeline with:
 *   - `fetch` stubbed         -> no request ever reaches the live MailerLite account,
 *   - the lead write stubbed  -> no request ever reaches the real Neon database,
 *   - a fake API key          -> the real secret is never read or printed.
 *
 * Run with: bun test tests/free-sample-failure-path.test.ts
 */
import { afterEach, describe, expect, test } from "bun:test";
import { forwardToMailerLite, handleFreeSample } from "../src/lib/freeSample";
import {
  FAILURE_MESSAGE,
  SUCCESS_MESSAGE,
  submitOutcome,
} from "../src/components/FreeSampleForm";

const LEAD = {
  name: "Ada Lovelace",
  email: "Ada@Example.COM",
  packSlug: "nutrition",
};
const CLEAN_EMAIL = "ada@example.com";
/** Fake key — never the real secret, never printed. */
const FAKE_KEY = "ml|test-key-not-a-real-secret";

const realFetch = globalThis.fetch;

interface StubbedFetch {
  calls: { url: string; method: string }[];
  restore: () => void;
}

/** Replace global fetch for one test; records every URL + method it was given. */
function stubFetch(
  handler: (url: string, method: string) => Response,
): StubbedFetch {
  const calls: { url: string; method: string }[] = [];
  globalThis.fetch = (async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const url =
      typeof input === "string" ? input : String((input as Request).url ?? input);
    const method = init?.method ?? "GET";
    calls.push({ url, method });
    return handler(url, method);
  }) as typeof fetch;
  return {
    calls,
    restore: () => {
      globalThis.fetch = realFetch;
    },
  };
}

/** In-memory stand-in for the Neon `leads` table + the subscribed flag. */
function leadStore(forward = async () => true) {
  const leads: { name: string | null; email: string; packSlug: string | null }[] =
    [];
  const marked: string[] = [];
  return {
    leads,
    marked,
    deps: {
      recordLead: async (lead: {
        name: string | null;
        email: string;
        packSlug: string | null;
      }) => {
        leads.push(lead);
      },
      markSubscribed: async (email: string) => {
        marked.push(email);
      },
      resolveApiKey: () => FAKE_KEY,
      forward,
    },
  };
}

/** The real MailerLite client, wired to the stubbed network above. */
const realForward = (key: string, email: string, name: string | null) =>
  forwardToMailerLite(key, email, name);

afterEach(() => {
  globalThis.fetch = realFetch;
});

describe("free sample opt-in — a MailerLite failure is visible to the visitor", () => {
  test("MailerLite returns non-2xx: visitor sees the failure message, lead kept with subscribed=false", async () => {
    const net = stubFetch(
      () =>
        new Response(JSON.stringify({ message: "Service Unavailable" }), {
          status: 503,
        }),
    );
    const store = leadStore(realForward);

    // The FORM's own submit pipeline, the real handler, the real MailerLite
    // client — only the network and the lead write are stubbed.
    const outcome = await submitOutcome(
      (data) => handleFreeSample(data, store.deps),
      LEAD,
    );

    // 1. The visitor is told the truth, never "check your inbox".
    expect(outcome.status).toBe("error");
    expect(outcome.message).toBe(FAILURE_MESSAGE);
    expect(outcome.message).not.toBe(SUCCESS_MESSAGE);

    // 2. The MailerLite call really was attempted, and nothing left the box.
    expect(net.calls.some((c) => c.url.includes("/subscribers"))).toBe(true);
    expect(
      net.calls.every((c) => c.url.startsWith("https://connect.mailerlite.com/")),
    ).toBe(true);

    // 3. The lead survives the failure, un-subscribed, so it can be recovered.
    expect(store.leads).toHaveLength(1);
    expect(store.leads[0]).toEqual({
      name: LEAD.name,
      email: CLEAN_EMAIL,
      packSlug: LEAD.packSlug,
    });
    expect(store.marked).toHaveLength(0); // subscribed stays false

    net.restore();
  });

  test("server contract: a rejected API key returns ok:true with subscribed=false — never a throw, never a false success", async () => {
    const net = stubFetch(
      () =>
        new Response(JSON.stringify({ message: "Unauthenticated." }), {
          status: 401,
        }),
    );
    const store = leadStore(realForward);

    const result = await handleFreeSample(LEAD, store.deps);

    expect(result).toEqual({ ok: true, subscribed: false });
    expect(store.leads).toHaveLength(1);
    expect(store.marked).toHaveLength(0);

    net.restore();
  });

  test("MailerLite throws (network error): same failure message, lead still kept", async () => {
    const net = stubFetch(() => {
      throw new Error("socket hang up");
    });
    const store = leadStore(realForward);

    const outcome = await submitOutcome(
      (data) => handleFreeSample(data, store.deps),
      LEAD,
    );

    expect(outcome).toEqual({ status: "error", message: FAILURE_MESSAGE });
    expect(store.leads).toHaveLength(1);
    expect(store.leads[0].email).toBe(CLEAN_EMAIL);
    expect(store.marked).toHaveLength(0);

    net.restore();
  });

  test("no API key configured: no subscriber is created, so the visitor gets the failure message and the lead is kept", async () => {
    const net = stubFetch(() => new Response("{}", { status: 200 }));
    const store = leadStore(realForward);

    const outcome = await submitOutcome(
      (data) =>
        handleFreeSample(data, { ...store.deps, resolveApiKey: () => null }),
      LEAD,
    );

    expect(outcome).toEqual({ status: "error", message: FAILURE_MESSAGE });
    expect(net.calls).toHaveLength(0);
    expect(store.leads).toHaveLength(1);
    expect(store.marked).toHaveLength(0);

    net.restore();
  });

  test("failure copy promises no email and never reads like the success state", () => {
    expect(FAILURE_MESSAGE).not.toBe(SUCCESS_MESSAGE);
    expect(FAILURE_MESSAGE.toLowerCase()).not.toMatch(
      /inbox|on its way|sent|delivered|arriving|check your/,
    );
  });

  test("success path is unchanged: subscribed=true still shows the exact success message", async () => {
    const net = stubFetch((url) =>
      url.includes("/groups")
        ? new Response(
            JSON.stringify({ data: [{ id: "grp_1", name: "Welcome" }] }),
            { status: 200 },
          )
        : new Response(JSON.stringify({ data: { id: "sub_1" } }), {
            status: 201,
          }),
    );
    const store = leadStore(realForward);

    const outcome = await submitOutcome(
      (data) => handleFreeSample(data, store.deps),
      LEAD,
    );

    expect(outcome).toEqual({ status: "success", message: SUCCESS_MESSAGE });
    expect(store.leads).toHaveLength(1);
    expect(store.marked).toEqual([CLEAN_EMAIL]); // subscribed flipped to true
    // Byte-for-byte the copy that shipped before this fix.
    expect(SUCCESS_MESSAGE).toBe(
      "Check your inbox — your sample article is on its way.",
    );

    net.restore();
  });

  test("an invalid address still throws before anything is written or forwarded", async () => {
    const net = stubFetch(() => new Response("{}", { status: 200 }));
    const store = leadStore(realForward);

    await expect(
      handleFreeSample({ email: "not-an-email" }, store.deps),
    ).rejects.toThrow("Please enter a valid email address.");
    expect(store.leads).toHaveLength(0);
    expect(net.calls).toHaveLength(0);

    net.restore();
  });
});
