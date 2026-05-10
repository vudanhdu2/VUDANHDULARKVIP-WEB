/**
 * Login page — server component, không cần state.
 * Hiển thị nút "Sign in with GitHub" + cảnh báo nếu OAuth chưa configured.
 */

import { AlertCircle, Github } from "lucide-react";
import Link from "next/link";
import { signIn } from "@/lib/auth";
import { isOAuthConfigured } from "@/lib/env";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const oauthOk = isOAuthConfigured();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            <span className="brand-gradient">VUDANHDULARKVIP</span>
          </CardTitle>
          <CardDescription>Đăng nhập để vào trang admin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!oauthOk && (
            <div className="flex gap-2 rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm">
              <AlertCircle className="size-4 mt-0.5 flex-none text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="font-medium text-yellow-700 dark:text-yellow-300">
                  GitHub OAuth chưa cấu hình
                </p>
                <p className="text-yellow-700/80 dark:text-yellow-400/80 text-xs mt-1">
                  Tạo OAuth app tại{" "}
                  <a
                    href="https://github.com/settings/developers"
                    className="underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    github.com/settings/developers
                  </a>{" "}
                  rồi điền vào <code>.env.local</code>.
                </p>
              </div>
            </div>
          )}

          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/admin/dashboard" });
            }}
          >
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!oauthOk}
            >
              <Github /> Đăng nhập với GitHub
            </Button>
          </form>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Về trang chủ
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
