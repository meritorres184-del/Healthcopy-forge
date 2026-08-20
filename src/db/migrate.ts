import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { sql } from "../db";

/**
 * Migration runner. Reads *.sql files from src/db/migrations/ in sorted order
 * and applies any that haven't been applied yet. Applied migration names are
 * recorded in a `_migrations` tracking table, so re-running is a safe no-op.
 *
 * Run standalone with:  bun run db:migrate
 */
export async function migrate() {
  const db = sql();

  await db`create table if not exists _migrations (
    id          SERIAL PRIMARY KEY,
    name        TEXT UNIQUE NOT NULL,
    applied_at  TIMESTAMPTZ DEFAULT now()
  )`;

  const dir = join(import.meta.dir, "migrations");
  const files = (await readdir(dir))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const applied = await db`select 1 from _migrations where name = ${file}`;
    if (applied.length > 0) {
      console.log(`skip ${file} (already applied)`);
      continue;
    }
    const sqlText = await readFile(join(dir, file), "utf8");

    // NOTE: split the file into individual statements and run each one. The
    // neon over-HTTP driver's `unsafe()` path silently drops DDL (rolled back),
    // and it rejects multiple statements in a single request, so we run each
    // `;`-terminated statement through the committing `query()` path instead.
    const statements = sqlText
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      await db.query(stmt, []);
    }

    await db`insert into _migrations (name) values (${file})`;
    console.log(`applied ${file}`);
  }

  console.log("migrations complete");
}

if (import.meta.main) {
  migrate()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
