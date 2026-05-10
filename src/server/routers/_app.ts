/**
 * Root tRPC router — gắn tất cả sub-routers tại đây.
 */

import { router } from "../trpc";
import { healthRouter } from "./health";
import { recordsRouter } from "./records";

export const appRouter = router({
  health: healthRouter,
  records: recordsRouter,
  // Sẽ thêm Tier 2+: pipeline, audit, run, diff, cost, config, glossary
});

export type AppRouter = typeof appRouter;
