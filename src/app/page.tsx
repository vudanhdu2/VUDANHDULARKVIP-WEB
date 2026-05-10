import { ArrowRight, BookOpen, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-16 max-w-6xl">
        <Badge variant="secondary" className="mb-4">
          <Sparkles className="size-3 mr-1" /> v2.0 — async pipeline
        </Badge>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          <span className="brand-gradient">VUDANHDULARKVIP</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8">
          Wiki AI/AGI tiếng Việt — clone, dịch và đồng bộ liên tục từ
          nguồn Feishu CN sang Larksuite, dành cho người Việt.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link href="/search">
              <Search /> Tìm kiếm tài liệu
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/docs">
              <BookOpen /> Duyệt wiki
            </Link>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <Link href="/admin/dashboard">
              Admin <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>📥 Tự động đồng bộ</CardTitle>
              <CardDescription>
                Crawl daily từ Feishu CN. Tự phát hiện
                NEW/EDITED/RENAMED/DELETED.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Eager-placeholder strategy — backlinks resolve được sớm
              từ stage đầu tiên.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🌐 Dịch thuần Việt</CardTitle>
              <CardDescription>
                LLM POOL round-robin với glossary chuẩn + quality gate.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Văn phong tự nhiên, ZERO ký tự CJK trong output, auto-retry
              với strict prompt.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🛡️ Resilience layer</CardTitle>
              <CardDescription>
                CircuitBreaker + QuotaTracker + PersistentQueue.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Recover sau crash, mất điện, rate-limit. Smart sync giảm
              100× PATCH calls.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 max-w-6xl text-sm text-muted-foreground flex flex-wrap gap-4 justify-between">
          <p>
            © 2026 VŨ DANH DỰ · Mirror{" "}
            <span className="font-medium">waytoagi.feishu.cn</span> →{" "}
            <span className="font-medium">vudanhdu.sg.larksuite.com</span>
          </p>
          <p>
            <a
              href="https://github.com/vudanhdu2/VUDANHDULARKVIP"
              className="hover:text-foreground"
              target="_blank"
              rel="noreferrer"
            >
              GitHub →
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
