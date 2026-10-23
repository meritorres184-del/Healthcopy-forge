#!/usr/bin/env python3
"""Generate the /sales/<course> catalogue for the 35 PLR courses.

SOURCE OF TRUTH for every word: the marketer's paste-ready vendor posting kit,
`marketing/courses-jvzoo-posting-kit.md` (§2 index + §7 blocks). The
"Sales-page copy" block of each §7 listing is copied out VERBATIM — no rewording,
no shortening, no added claims — and rendered on the course's own
`/sales/<slug>` page (the JVZoo form itself only takes the 255-character
one-liner, which this module deliberately ignores).

Run from the repo root:

    python3 scripts/build-course-catalog.py

Outputs (all regenerated; do not hand-edit them):
  * `src/lib/courses.ts`      — the 35 courses: slug, title, delivery ZIP, cover
                                file, category, verbatim sales-page copy.
  * `src/lib/courseCovers.ts` — slug -> `/covers/course-<slug>.jpg`.
  * `public/covers/course-<slug>.jpg` — the listing cover JPG, copied from
                                `marketing/course-covers/course-<slug>-cover.jpg`
                                (same bytes, renamed to a URL-safe name exactly the
                                way src/lib/ebookCovers.ts works for the ebooks).
"""
import hashlib
import json
import re
import shutil
from pathlib import Path

SHARED = Path("/home/team/shared")
REPO = SHARED / "Healthcopy-forge"
KIT = SHARED / "marketing" / "courses-jvzoo-posting-kit.md"
COVER_SRC = SHARED / "marketing" / "course-covers"
COVER_DST = REPO / "public" / "covers"

lines = KIT.read_text(encoding="utf-8").split("\n")

# --- §2 index: number, title, slug, release ZIP, category -------------------
i2 = next(i for i, l in enumerate(lines) if l.startswith("## 2 ·"))
i3 = next(i for i, l in enumerate(lines) if l.startswith("## 3 ·"))
index = {}
order = []
for l in lines[i2:i3]:
    m = re.match(
        r"^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*`([a-z0-9-]+)`\s*\|\s*`(course-[a-z0-9-]+\.zip)`\s*\|\s*(.+?)\s*\|",
        l,
    )
    if m:
        num, title, slug, zipname, cat = m.groups()
        index[slug] = dict(num=int(num), title=title, slug=slug, zip=zipname, category=cat)
        order.append(slug)
assert len(index) == 35, len(index)

# --- §7 blocks: the verbatim sales-page copy --------------------------------
i7 = next(i for i, l in enumerate(lines) if l.startswith("## 7 ·"))
i8 = next(i for i, l in enumerate(lines) if l.startswith("## 8 ·"))
heads = [(i, l) for i, l in enumerate(lines) if i7 < i < i8 and l.startswith("### ")]

records = []
for k, (start, head) in enumerate(heads):
    end = heads[k + 1][0] if k + 1 < len(heads) else i8
    block = lines[start:end]
    title = re.match(r"^### \d+ · (.+?) — PLR Course\s*$", head).group(1)
    slug = cover = zipname = None
    desc, collecting = None, False
    for l in block:
        if l.startswith("*Slug `"):
            slug = re.match(r"^\*Slug `([a-z0-9-]+)`", l).group(1)
        if l.startswith("**Sales-page copy"):
            collecting, desc = True, []
            continue
        if collecting:
            if l.startswith("**Category (R3):**") or l.startswith("*The 3rd paragraph"):
                collecting = False
                continue
            if l.startswith(">"):
                body = l[1:]
                desc.append(body[1:] if body.startswith(" ") else body)
            elif l.strip():
                collecting = False
        m = re.search(r"\*\*Upload this file \(delivery\):\*\* `(course-[a-z0-9-]+\.zip)`", l)
        if m:
            zipname = m.group(1)
        m = re.search(r"\*\*Cover image \(no upload needed\):\*\* `(course-[a-z0-9-]+-cover\.jpg)`", l)
        if m:
            cover = m.group(1)
    while desc and not desc[0].strip():
        desc.pop(0)
    while desc and not desc[-1].strip():
        desc.pop()
    assert slug and cover and zipname and desc, head
    row = index[slug]
    assert title == row["title"], (title, row["title"])
    assert zipname == row["zip"], (zipname, row["zip"])
    # The owner's own "Course Description for Listings" sentence must be present,
    # quoted verbatim, in every course's sales-page copy (kit §4/§7).
    assert "This is a done-for-you PLR (private label rights) course" in "\n".join(desc), slug
    records.append(
        dict(
            num=row["num"],
            slug=slug,
            title=title,
            zip=zipname,
            cover=cover,
            category=row["category"],
            description="\n".join(desc),
        )
    )

assert len(records) == 35, len(records)
assert [r["slug"] for r in records] == order, "§7 order and §2 index order disagree"

# --- covers: same bytes, URL-safe name -------------------------------------
COVER_DST.mkdir(parents=True, exist_ok=True)
cover_hashes = {}
for r in records:
    src = COVER_SRC / r["cover"]
    dst = COVER_DST / ("course-" + r["slug"] + ".jpg")
    assert src.is_file(), src
    shutil.copyfile(src, dst)
    cover_hashes[r["slug"]] = hashlib.sha256(src.read_bytes()).hexdigest()[:12]

# --- src/lib/courses.ts -----------------------------------------------------
out = []
out.append("// HealthCopy Forge PLR courses — the 35 standalone $47 courses and their")
out.append("// /sales/<course> pages.")
out.append("//")
out.append("// GENERATED FILE — do not edit by hand. Run `python3 scripts/build-course-catalog.py`.")
out.append("//")
out.append("// COPY SOURCE: /home/team/shared/marketing/courses-jvzoo-posting-kit.md — the")
out.append("// marketer's paste-ready JVZoo vendor kit. §2 is the index (display title, slug,")
out.append("// release ZIP, category) and each §7 block carries, under the heading")
out.append("//")
out.append('//   "Sales-page copy (NOT for the JVZoo form — goes on the /sales page):"')
out.append("//")
out.append("// the long-form copy for that course's own sales page. That copy is rendered")
out.append("// VERBATIM on /sales/<slug>: do not reword, shorten, soften or add claims. It")
out.append("// includes the owner's own \"Course Description for Listings\" sentence, quoted")
out.append("// from the course document itself. The 255-character one-liner the kit prints for")
out.append("// the JVZoo form is deliberately NOT used here.")
out.append("//")
out.append("// Static on purpose (no database read): every course page is baked to HTML at")
out.append("// build time by the prerender step in vite.config.ts, so it can never degrade")
out.append("// into a content-less page the way a DB-backed page can.")
out.append("//")
out.append("// Buy links are NOT here. JVZoo product IDs do not exist for the courses yet —")
out.append("// the owner creates the 35 listings and sends the IDs, and each one is then added")
out.append("// to src/jvzoo.ts (one line per course). Until then the page renders the price")
out.append("// and the marked injection point in src/routes/sales.$slug.tsx.")
out.append("export interface Course {")
out.append("  /** Site slug — used for /sales/<slug> and the release ZIP name `course-<slug>.zip`. */")
out.append("  slug: string;")
out.append("  /** Course display title (cover inventory + JVZoo listing name). */")
out.append("  title: string;")
out.append("  /** Release ZIP the owner uploads to JVZoo (file name only). */")
out.append("  zip: string;")
out.append("  /** Cover JPG delivered as the listing image (file name only). */")
out.append("  coverFile: string;")
out.append("  /** JVZoo shelf for this course, from kit §3. */")
out.append("  category: string;")
out.append("  /** The kit's long-form sales-page copy — verbatim, line-based. */")
out.append("  description: string;")
out.append("}")
out.append("")
out.append("/** Every course, in the kit's §2/§7 order (alphabetical by display title). */")
out.append("export const COURSES: Course[] = [")
for r in records:
    out.append("  {")
    out.append("    slug: " + json.dumps(r["slug"]) + ",")
    out.append("    title: " + json.dumps(r["title"]) + ",")
    out.append("    zip: " + json.dumps(r["zip"]) + ",")
    out.append("    coverFile: " + json.dumps(r["cover"]) + ",")
    out.append("    category: " + json.dumps(r["category"]) + ",")
    out.append("    description: " + json.dumps(r["description"]) + ",")
    out.append("  },")
out.append("];")
out.append("")
out.append("/** Slugs of every course page that must be pre-rendered (see vite.config.ts). */")
out.append("export const COURSE_SLUGS: string[] = COURSES.map((c) => c.slug);")
out.append("")
out.append("/** The course for a page slug, or undefined for an unknown slug. */")
out.append("export function courseBySlug(slug: string): Course | undefined {")
out.append("  return COURSES.find((c) => c.slug === slug);")
out.append("}")
out.append("")
(REPO / "src" / "lib" / "courses.ts").write_text("\n".join(out), encoding="utf-8")

# --- src/lib/courseCovers.ts ------------------------------------------------
c = []
c.append("// Course cover images — ONE map, keyed by course slug.")
c.append("//")
c.append("// Each file is the listing cover JPG the owner delivers with the course")
c.append("// (`course-<slug>-cover.jpg`, 1410x2250, inside course-covers.zip), copied here")
c.append("// byte-for-byte under the clean, predictable name `/covers/course-<slug>.jpg` —")
c.append("// the owner's delivery filenames carry the `course-` / `-cover` wrapper that the")
c.append("// site does not need in a URL. Mirror of src/lib/packCovers.ts and")
c.append("// src/lib/ebookCovers.ts: adding a course means one line here, and a slug with no")
c.append("// cover renders no image rather than someone else's cover.")
c.append("//")
c.append("// GENERATED by scripts/build-course-catalog.py (which also copies the files).")
c.append("// sha256[:12] of each delivered cover file, for a fast integrity check:")
for r in records:
    c.append("//   " + r["slug"] + " " + cover_hashes[r["slug"]])
c.append("export const COURSE_COVERS: Record<string, string> = {")
for r in records:
    c.append(
        "  " + json.dumps(r["slug"]) + ": " + json.dumps("/covers/course-" + r["slug"] + ".jpg") + ","
    )
c.append("};")
c.append("")
c.append("/** Cover path for a course slug, or undefined when that course has no cover file. */")
c.append("export function courseCover(slug: string): string | undefined {")
c.append("  return COURSE_COVERS[slug];")
c.append("}")
c.append("")
(REPO / "src" / "lib" / "courseCovers.ts").write_text("\n".join(c), encoding="utf-8")

print("courses written:", len(records))
print("cover files copied:", len(records))
print("description chars:", min(len(r["description"]) for r in records), "..", max(len(r["description"]) for r in records))
