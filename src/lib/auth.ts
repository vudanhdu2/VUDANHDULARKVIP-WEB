/**
 * NextAuth v5 — GitHub OAuth + allowlist.
 *
 * Khi `GITHUB_CLIENT_ID=placeholder` (chưa cấu hình OAuth), web vẫn
 * chạy được nhưng `/admin/*` route sẽ redirect login. User có thể
 * fill `.env.local` rồi restart để bật.
 *
 * Allowlist `ALLOWED_GITHUB_USERS` (comma-separated GitHub usernames)
 * chặn user lạ login — chỉ team được approve mới qua được.
 */

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { env } from "./env";

const allowed = (): Set<string> => {
  const list = env()
    .ALLOWED_GITHUB_USERS.split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return new Set(list);
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: env().GITHUB_CLIENT_ID,
      clientSecret: env().GITHUB_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 ngày
  },
  callbacks: {
    async signIn({ profile }) {
      const list = allowed();
      // Empty list → cho phép mọi user (dev mode)
      if (list.size === 0) return true;
      const username = (profile?.login as string | undefined)?.toLowerCase();
      return Boolean(username && list.has(username));
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      // Truyền GitHub username vào session
      if (session.user && token.login) {
        (session.user as typeof session.user & { login?: string }).login =
          token.login as string;
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile?.login) {
        token.login = profile.login;
      }
      return token;
    },
  },
});
