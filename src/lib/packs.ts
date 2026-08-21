import { createServerFn } from "@tanstack/react-start";
import { sql } from "../db";

export interface Pack {
  slug: string;
  title: string;
  description: string;
  price: number;
  category: string;
  comingSoon: boolean;
  includes: string[];
}

function mapRow(r: any): Pack {
  return {
    slug: r.slug,
    title: r.title,
    description: r.description,
    price: (r.price_cents as number) / 100,
    category: r.category,
    comingSoon: r.coming_soon as boolean,
    includes: r.includes as string[],
  };
}

// All packs that are live (not "coming soon") — shown in the member library.
export const getLibraryPacks = createServerFn({
  method: "GET",
}).handler(async () => {
  const rows = await sql()`
    select slug, title, description, price_cents, category, coming_soon, includes
    from content_packs
    where coming_soon = false
    order by id`;
  return rows.map(mapRow);
});

// A single pack by slug (returns null if not found).
export const getPackBySlug = createServerFn({
  method: "GET",
}).handler(async ({ slug }: { slug: string }) => {
  const rows = await sql()`
    select slug, title, description, price_cents, category, coming_soon, includes
    from content_packs
    where slug = ${slug}`;
  if (rows.length === 0) return null;
  return mapRow(rows[0]);
});
