/**
 * tRPC HTTP handler — Next.js App Router API route.
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";
import { appRouter } from "@/server/routers/_app";
import { createTRPCContext } from "@/server/trpc";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () =>
      createTRPCContext({
        headers: req.headers,
      }),
    onError({ error, path }) {
      console.error(`[tRPC] error in ${path ?? "<unknown>"}:`, error.message);
    },
  });

export { handler as GET, handler as POST };
