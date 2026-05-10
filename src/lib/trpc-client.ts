/**
 * tRPC client cho React components.
 *
 * Usage:
 *   const { data } = trpc.health.status.useQuery();
 */

"use client";

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/routers/_app";

export const trpc = createTRPCReact<AppRouter>();
