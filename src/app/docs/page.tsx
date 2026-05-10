import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Duyệt wiki",
  description: "Browse mọi tài liệu đã được dịch sang tiếng Việt",
};

export default function DocsIndexPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <BookOpen className="size-8 text-primary" /> Wiki tiếng Việt
          </h1>
          <p className="text-muted-foreground mt-2">
            Tài liệu AI/AGI dịch sang tiếng Việt từ nguồn{" "}
            <code className="text-sm">waytoagi.feishu.cn</code>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>🚧 Đang xây dựng</CardTitle>
            <CardDescription>
              Tier 5 sẽ implement public viewer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Sẽ có:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Tree navigation theo cấu trúc wiki gốc</li>
              <li>Markdown rendering với shiki syntax highlight</li>
              <li>Full-text search (Fuse.js client-side)</li>
              <li>Open Graph + JSON-LD cho SEO</li>
              <li>"View source on Larksuite" link</li>
            </ul>
            <div className="pt-3 mt-3 border-t">
              <Link
                href="/admin/dashboard"
                className="text-primary hover:underline flex items-center gap-1 w-fit"
              >
                Vào Admin Console <ChevronRight className="size-4" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[
            { name: "Hướng dẫn", count: "1,247", color: "primary" },
            { name: "Công cụ AI", count: "892", color: "stage-running" },
            { name: "Thực chiến", count: "456", color: "stage-done" },
          ].map((cat) => (
            <Card key={cat.name} className="hover:bg-accent/50 cursor-pointer transition-colors">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <BookOpen className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {cat.count} tài liệu
                  </p>
                </div>
                <Badge variant="outline">soon</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
