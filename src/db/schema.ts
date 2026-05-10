/**
 * Drizzle schema mapping V2 SQLite cache + web app's own DB.
 *
 * V2 schemas (read-only):
 *   - translations(key, translated, created_at)
 *   - media_tokens(src_token, dst_token, size, created_at)
 *   - pending_operations(operation_id, ..., status, attempts, ...)
 *   - runs(run_id, src_space_id, started_at, ..., status)
 *   - walked_tokens(run_id, src_token, walked_at)
 *
 * Web schemas (read-write):
 *   - admin_audit_log(id, user, action, target, ts, details)
 *   - glossary_edits(id, cn_text, vi_text, kind, edited_by, ts)
 *   - run_logs(id, command, started_at, completed_at, exit_code, stdout)
 */

import { sql } from "drizzle-orm";
import {
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

/* ============================================================ */
/* V2 Translation Cache schema (read-only)                       */
/* ============================================================ */

export const translations = sqliteTable("translations", {
  key: text("key").primaryKey(),
  translated: text("translated").notNull(),
  createdAt: real("created_at"),
});

/* ============================================================ */
/* V2 Persistent Queue schema                                    */
/* ============================================================ */

export const pendingOperations = sqliteTable("pending_operations", {
  operationId: text("operation_id").primaryKey(),
  operationType: text("operation_type").notNull(),
  payloadJson: text("payload_json").notNull(),
  status: text("status").notNull().default("pending"),
  attempts: integer("attempts").notNull().default(0),
  maxAttempts: integer("max_attempts").notNull().default(5),
  lastError: text("last_error").notNull().default(""),
  createdAt: real("created_at").notNull(),
  scheduledAt: real("scheduled_at").notNull(),
  processedAt: real("processed_at"),
});

/* ============================================================ */
/* V2 Crawl Checkpoint schema                                    */
/* ============================================================ */

export const runs = sqliteTable("runs", {
  runId: text("run_id").primaryKey(),
  srcSpaceId: text("src_space_id").notNull(),
  startedAt: real("started_at").notNull(),
  completedAt: real("completed_at"),
  status: text("status").notNull().default("running"),
  walkedCount: integer("walked_count").notNull().default(0),
  lastWalkedToken: text("last_walked_token").notNull().default(""),
});

export const walkedTokens = sqliteTable("walked_tokens", {
  runId: text("run_id").notNull(),
  srcToken: text("src_token").notNull(),
  walkedAt: real("walked_at").notNull(),
});

/* ============================================================ */
/* Web app's own DB schemas (read-write)                         */
/* ============================================================ */

/**
 * Audit log cho admin actions (login, trigger run, edit glossary).
 */
export const adminAuditLog = sqliteTable("admin_audit_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user: text("user").notNull(),
  action: text("action").notNull(),
  target: text("target").default(""),
  detailsJson: text("details_json").default("{}"),
  ts: real("ts")
    .notNull()
    .default(sql`(unixepoch('subsec'))`),
});

/**
 * Glossary edits từ admin UI — sync với Python V2 sau.
 */
export const glossaryEdits = sqliteTable("glossary_edits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cnText: text("cn_text").notNull(),
  viText: text("vi_text").notNull(),
  kind: text("kind").notNull(), // people/brands/ai_tools/phrases/tech_terms
  editedBy: text("edited_by").notNull(),
  ts: real("ts")
    .notNull()
    .default(sql`(unixepoch('subsec'))`),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

/**
 * Lưu output của các commands user trigger từ UI.
 */
export const runLogs = sqliteTable("run_logs", {
  id: text("id").primaryKey(), // UUID
  command: text("command").notNull(),
  argsJson: text("args_json").default("[]"),
  triggeredBy: text("triggered_by").notNull(),
  startedAt: real("started_at").notNull(),
  completedAt: real("completed_at"),
  exitCode: integer("exit_code"),
  stdoutTail: text("stdout_tail").default(""), // last 100 lines
  stderrTail: text("stderr_tail").default(""),
});
