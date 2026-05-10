/**
 * Health check router — verify backend alive + V2 DB reachable.
 */

import { isDbReachable } from "@/lib/db";
import { env, isOAuthConfigured } from "@/lib/env";
import { publicProcedure, router } from "../trpc";

export const healthRouter = router({
  ping: publicProcedure.query(() => ({ pong: true, ts: Date.now() })),

  status: publicProcedure.query(async () => {
    const e = env();
    const checks: Record<string, { ok: boolean; detail?: string }> = {};

    // V2 caches (file-based, có thể chưa tồn tại nếu V2 chưa chạy)
    const trans = await isDbReachable(`file:${e.V2_TRANSLATION_CACHE_DB}`);
    checks.v2_translation_db = {
      ok: trans.ok,
      detail: trans.ok ? "reachable" : `missing: ${trans.error}`,
    };

    const queue = await isDbReachable(`file:${e.V2_PERSISTENT_QUEUE_DB}`);
    checks.v2_persistent_queue_db = {
      ok: queue.ok,
      detail: queue.ok ? "reachable" : `missing: ${queue.error}`,
    };

    const crawl = await isDbReachable(`file:${e.V2_CRAWL_CHECKPOINT_DB}`);
    checks.v2_crawl_checkpoint_db = {
      ok: crawl.ok,
      detail: crawl.ok ? "reachable" : `missing: ${crawl.error}`,
    };

    // Web DB
    const web = await isDbReachable(e.WEB_DB_URL);
    checks.web_db = {
      ok: web.ok,
      detail: web.ok ? "reachable" : web.error ?? "unknown error",
    };

    // OAuth
    checks.oauth = {
      ok: isOAuthConfigured(),
      detail: isOAuthConfigured()
        ? "configured"
        : "placeholder — fill .env.local để bật login",
    };

    // OK = web_db + oauth (V2 caches optional khi V2 chưa chạy)
    const ok = checks.web_db.ok && checks.oauth.ok;

    return { ok, checks };
  }),
});
