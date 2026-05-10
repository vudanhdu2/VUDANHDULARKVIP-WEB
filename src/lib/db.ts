/**
 * Drizzle ORM clients — lazy init để build pass kể cả khi V2 caches
 * chưa tồn tại. Connection chỉ mở khi caller thực sự gọi query.
 */

import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { type Client, createClient } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { env } from "./env";

interface DbHandle {
  client: Client;
  db: LibSQLDatabase;
}

const cache = new Map<string, DbHandle>();

function getOrCreate(key: string, url: string, ensureDir = false): DbHandle {
  const existing = cache.get(key);
  if (existing) return existing;

  // Tạo parent dir nếu cần (cho web DB write)
  if (ensureDir) {
    const filePath = url.startsWith("file:") ? url.slice("file:".length) : url;
    const dir = dirname(filePath);
    if (dir && !existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  const client = createClient({ url });
  const db = drizzle(client);
  const handle: DbHandle = { client, db };
  cache.set(key, handle);
  return handle;
}

/** V2 translation cache — read-only. */
export function getV2TranslationDb(): LibSQLDatabase {
  return getOrCreate("v2_trans", `file:${env().V2_TRANSLATION_CACHE_DB}`).db;
}

/** V2 persistent queue — read-only. */
export function getV2QueueDb(): LibSQLDatabase {
  return getOrCreate("v2_queue", `file:${env().V2_PERSISTENT_QUEUE_DB}`).db;
}

/** V2 crawl checkpoint — read-only. */
export function getV2CrawlDb(): LibSQLDatabase {
  return getOrCreate("v2_crawl", `file:${env().V2_CRAWL_CHECKPOINT_DB}`).db;
}

/** Web app's own DB — read-write. Auto-create folder. */
export function getWebDb(): LibSQLDatabase {
  return getOrCreate("web", env().WEB_DB_URL, true).db;
}

/**
 * Graceful close mọi connection (cho test cleanup).
 */
export async function closeAllDbs(): Promise<void> {
  for (const { client } of cache.values()) {
    client.close();
  }
  cache.clear();
}

/**
 * Check 1 DB có reachable không (dùng cho health check).
 */
export async function isDbReachable(
  url: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const c = createClient({ url });
    await c.execute("SELECT 1");
    c.close();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message.slice(0, 200) };
  }
}
