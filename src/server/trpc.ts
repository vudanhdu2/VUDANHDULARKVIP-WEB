/**
 * tRPC v11 server — type-safe RPC giữa Next.js client và server.
 *
 * 3 procedure types:
 *   - publicProcedure  : ai cũng gọi được (homepage, search)
 *   - protectedProcedure : require login (admin actions)
 *   - adminProcedure   : require login + GitHub username trong allowlist
 */

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";

interface CreateContextOptions {
  headers: Headers;
}

export async function createTRPCContext(opts: CreateContextOptions) {
  const session = await auth();
  return {
    session,
    headers: opts.headers,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

/**
 * Protected — require auth.session.
 */
const enforceAuth = middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Bạn chưa đăng nhập.",
    });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceAuth);

/**
 * Admin — require auth + login trong allowlist (đã check ở NextAuth signIn).
 * Đây là wrapper alias cho semantic.
 */
export const adminProcedure = protectedProcedure;
