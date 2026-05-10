/**
 * Environment validation — strict typing cho mọi env var.
 * Fail fast khi thiếu critical config.
 */

import { z } from "zod";

const envSchema = z.object({
  // Node
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),

  // GitHub OAuth (placeholder ok cho dev)
  GITHUB_CLIENT_ID: z.string().default("placeholder"),
  GITHUB_CLIENT_SECRET: z.string().default("placeholder"),

  // Cho phép GitHub username nào login (csv) — empty = mọi user
  ALLOWED_GITHUB_USERS: z.string().default(""),

  // Database — Path tới SQLite cache của V2 Python (read-only mở rộng)
  V2_TRANSLATION_CACHE_DB: z
    .string()
    .default("../vddclonelark-v2/.cache/translations.sqlite"),
  V2_PERSISTENT_QUEUE_DB: z
    .string()
    .default("../vddclonelark-v2/.cache/persistent_queue.db"),
  V2_CRAWL_CHECKPOINT_DB: z
    .string()
    .default("../vddclonelark-v2/.cache/crawl_checkpoint.db"),

  // Web app's own DB — store sessions, glossary edits, audit cache
  WEB_DB_URL: z.string().default("file:./.web-cache/web.db"),

  // Python V2 bridge
  PYTHON_BIN: z.string().default("python"),
  V2_REPO_PATH: z.string().default("../vddclonelark-v2"),

  // Lark Base — readonly proxy (cho admin UI hiển thị records)
  LARK_BASE_TOKEN: z.string().default(""),
  LARK_TABLE_ID: z.string().default(""),
  LARK_OPEN_URL: z.string().default("https://open.larksuite.com/open-apis"),
  LARK_APP_ID: z.string().default(""),
  LARK_APP_SECRET: z.string().default(""),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function env(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error(
      "[env] Validation failed:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment configuration. Xem .env.example.");
  }
  cached = parsed.data;
  return cached;
}

/**
 * Check OAuth có configured chưa (placeholder = chưa).
 */
export function isOAuthConfigured(): boolean {
  const e = env();
  return (
    e.GITHUB_CLIENT_ID !== "placeholder" &&
    e.GITHUB_CLIENT_SECRET !== "placeholder"
  );
}
