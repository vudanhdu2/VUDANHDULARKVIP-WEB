"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold flex items-center gap-3 mb-6">
          <Search className="size-8 text-primary" /> Tìm kiếm
        </h1>

        <div className="relative mb-8">
          <Search className="size-5 absolute left-4 top-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Nhập từ khoá... (vd: prompt, agent, fine-tune)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full h-13 pl-12 pr-4 rounded-lg border-2 border-input bg-card text-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {!query && (
          <Card>
            <CardHeader>
              <CardTitle>🚧 Search engine — Tier 5</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Tier 5 sẽ implement Fuse.js client-side full-text search trên
                metadata + Markdown content của các VI docs đã sync.
              </p>
              <p className="pt-2">
                Search index build từ <code>recordsRouter.list</code> +
                rendered markdown content (cached SSG).
              </p>
            </CardContent>
          </Card>
        )}

        {query && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Search cho <strong>&ldquo;{query}&rdquo;</strong> — chưa
              implement (Tier 5).
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
