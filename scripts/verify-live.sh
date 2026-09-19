#!/usr/bin/env bash
# LIVE ACCEPTANCE HARNESS — does the public site serve FULL sales pages, every time?
#
#   bash scripts/verify-live.sh              # 30 requests per URL, both hosts
#   REQUESTS=10 bash scripts/verify-live.sh  # quicker pass
#   ALL_ROUTES=1 bash scripts/verify-live.sh # every route, not just the 10 sales URLs
#   HOSTS=https://www.healthcopyforge.com bash scripts/verify-live.sh
#
# ‼️ WHY THIS SCRIPT EXISTS — the measurement trap that caused a false alarm:
#   `curl -w '%{size_download}'` reports the bytes ON THE WIRE. When the edge
#   negotiates compression (Accept-Encoding: gzip/zstd — curl --compressed always
#   asks for it) that number is the COMPRESSED size: a complete 40,738-byte page
#   reports ~5,000, which looks exactly like a truncated document. It is not.
#   This harness therefore sends `Accept-Encoding: identity` and measures the
#   bytes it actually saved, so the numbers below are real document bytes.
#
# A request PASSES when all of these hold:
#   * HTTP 200
#   * saved body >= MIN_BYTES (15000 for sales pages — a content-less shell is 3-8 KB)
#   * body contains a closing </html>  (the platform's preview proxy appends its
#     own reload script AFTER </html>, so this is a "contains", not "ends with")
#   * body does NOT contain the degraded marker ("Content temporarily unavailable")
#   * sales pages contain the JVZoo buy link AND the i.jvzoo.com tracking pixel
set -uo pipefail

REQUESTS="${REQUESTS:-30}"
HOSTS="${HOSTS:-https://www.healthcopyforge.com https://36a900ec156b5c0aaac2aa59e4503745.ctonew.app}"
MIN_BYTES="${MIN_BYTES:-15000}"
TIMEOUT="${TIMEOUT:-40}"

# The 9 JVZoo sales pages (the acceptance set) + every other route that must also
# be served from disk rather than streamed.
SALES_URLS=(
  /packs
  /library
  /library/nutrition-everyday-wellness
  /library/supplements-nutritional-support
  /library/fitness-exercise
  /library/sleep-recovery
  /library/stress-management-mind-body-wellness
  /library/healthy-aging-lifestyle
  /library/natural-holistic-wellness
  /library/product-reviews-buying-guides
)
OTHER_URLS=(
  /
  /pricing
  /membership
  /join
  /join/essentials
  /join/pro
  /downloads
  /affiliates
  /terms
  /privacy
  /disclaimer
  /support
  /purchase/success
  /purchase/cancel
  /checkout/nutrition-everyday-wellness
)
if [ "${ALL_ROUTES:-0}" = "1" ]; then URLS=("${SALES_URLS[@]}" "${OTHER_URLS[@]}"); else URLS=("${SALES_URLS[@]}"); fi

BODY="$(mktemp)"
trap 'rm -f "$BODY"' EXIT
overall=0
printf 'verify-live: %s request(s) per URL, %s host(s), floor %s bytes\n\n' \
  "$REQUESTS" "$(wc -w <<<"$HOSTS")" "$MIN_BYTES"

for host in $HOSTS; do
  echo "―― $host"
  printf '  %-52s %-7s %-15s %-5s %-5s %s\n' URL PASS RANGE BUY PIXEL NOTES
  for url in "${URLS[@]}"; do
    case " ${SALES_URLS[*]} " in *" $url "*) want_buy=1 ;; *) want_buy=0 ;; esac
    pass=0; fail=0; sizes=""; buy=0; pix=0
    e_http=0; e_size=0; e_close=0; e_deg=0; e_buy=0; e_pix=0
    for _ in $(seq 1 "$REQUESTS"); do
      code="$(curl -s --max-time "$TIMEOUT" -H 'Accept-Encoding: identity' \
                -o "$BODY" -w '%{http_code}' "$host$url" || echo 000)"
      size="$(wc -c < "$BODY" | tr -d ' ')"
      sizes="$sizes $size"
      body_ok=1
      [ "$code" = "200" ] || { body_ok=0; e_http=$((e_http + 1)); }
      [ "$size" -ge "$MIN_BYTES" ] || { body_ok=0; e_size=$((e_size + 1)); }
      grep -q '</html>' "$BODY" || { body_ok=0; e_close=$((e_close + 1)); }
      grep -q 'Content temporarily unavailable' "$BODY" && { body_ok=0; e_deg=$((e_deg + 1)); }
      grep -q 'jvzoo.com/b/' "$BODY" && buy=1
      grep -q 'i\.jvzoo\.com' "$BODY" && pix=1
      if [ "$want_buy" = "1" ]; then
        [ "$buy" = "1" ] || { body_ok=0; e_buy=$((e_buy + 1)); }
        [ "$pix" = "1" ] || { body_ok=0; e_pix=$((e_pix + 1)); }
      fi
      if [ "$body_ok" = "1" ]; then pass=$((pass + 1)); else fail=$((fail + 1)); fi
    done
    lo="$(tr ' ' '\n' <<<"$sizes" | grep -E '^[0-9]+$' | sort -n | head -1)"
    hi="$(tr ' ' '\n' <<<"$sizes" | grep -E '^[0-9]+$' | sort -n | tail -1)"
    # One note per distinct problem, with how many requests hit it.
    notes=""
    [ "$e_http" -gt 0 ] && notes="$notes http!=200(×$e_http)"
    [ "$e_size" -gt 0 ] && notes="$notes size<$MIN_BYTES(×$e_size)"
    [ "$e_close" -gt 0 ] && notes="$notes no-</html>(×$e_close)"
    [ "$e_deg" -gt 0 ] && notes="$notes DEGRADED(×$e_deg)"
    [ "$e_buy" -gt 0 ] && notes="$notes no-buy-link(×$e_buy)"
    [ "$e_pix" -gt 0 ] && notes="$notes no-pixel(×$e_pix)"
    [ -n "$notes" ] || notes="ok"
    [ "$fail" -eq 0 ] || overall=1
    printf '  %-52s %-7s %-15s %-5s %-5s %s\n' \
      "$url" "$pass/$REQUESTS" "$lo-$hi" "$buy" "$pix" "$notes"
  done
  echo
done

if [ "$overall" -eq 0 ]; then
  echo "PASS — every request returned a full page served from disk."
else
  echo "FAIL — see the NOTES column above."
fi
exit "$overall"
