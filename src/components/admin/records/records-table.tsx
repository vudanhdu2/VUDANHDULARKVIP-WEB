"use client";

import { keepPreviousData } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/lib/trpc-client";
import { formatTimestamp, truncate } from "@/lib/utils";

const STAGES = [
  "Pending",
  "Crawling",
  "Placeholder",
  "Cloning",
  "Translating",
  "Mirroring",
  "Syncing",
  "Reordering",
  "Done",
  "Failed",
] as const;

type Stage = (typeof STAGES)[number];

function badgeVariantForStage(stage: string) {
  if (stage === "Done") return "done" as const;
  if (stage === "Failed") return "failed" as const;
  if (stage === "Pending" || stage === "Placeholder") return "pending" as const;
  return "running" as const;
}

export function RecordsTable() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | undefined>();
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, isLoading } = trpc.records.list.useQuery(
    { search: search || undefined, stage: stageFilter, limit, offset },
    { placeholderData: keepPreviousData, refetchInterval: 8000 },
  );

  const total = data?.total ?? 0;
  const items = data?.items ?? [];
  const useMock = data?.useMock ?? false;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>
            Records {total > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                {total.toLocaleString("vi-VN")} records
              </span>
            )}
            {useMock && (
              <Badge variant="outline" className="ml-2 text-xs">
                MOCK DATA — chưa cấu hình Lark
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="size-4 absolute left-2.5 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm theo title / token..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setOffset(0);
                }}
                className="h-9 pl-8 pr-3 w-64 rounded-md border border-input bg-background text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            {/* Stage filter */}
            <select
              value={stageFilter ?? ""}
              onChange={(e) => {
                setStageFilter((e.target.value as Stage) || undefined);
                setOffset(0);
              }}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="">Mọi stage</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Table */}
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-3 py-2 font-medium">STT</th>
                <th className="px-3 py-2 font-medium">Tiêu đề (VI)</th>
                <th className="px-3 py-2 font-medium">Title (CN)</th>
                <th className="px-3 py-2 font-medium">Stage</th>
                <th className="px-3 py-2 font-medium text-right">% Dịch</th>
                <th className="px-3 py-2 font-medium text-right">Blocks</th>
                <th className="px-3 py-2 font-medium text-right">LLM</th>
                <th className="px-3 py-2 font-medium">Last activity</th>
                <th className="px-3 py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && items.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-muted-foreground">
                    <Loader2 className="size-5 animate-spin inline mr-2" /> Đang tải...
                  </td>
                </tr>
              )}
              {!isLoading && items.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-muted-foreground">
                    Không có record nào khớp filter.
                  </td>
                </tr>
              )}
              {items.map((r) => (
                <tr key={r.recordId} className="border-t hover:bg-muted/30">
                  <td className="px-3 py-2 text-muted-foreground tabular-nums">
                    {r.stt ?? "—"}
                  </td>
                  <td className="px-3 py-2 max-w-xs">
                    <div className="font-medium truncate">{r.tieude || "—"}</div>
                  </td>
                  <td className="px-3 py-2 max-w-xs text-muted-foreground">
                    <div className="truncate">{truncate(r.title, 50)}</div>
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant={badgeVariantForStage(r.pipelineStage)}>
                      {r.pipelineStage}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {r.pctDich !== null ? `${r.pctDich.toFixed(0)}%` : "—"}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                    {r.cloneBlockCount ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                    {r.translateLlmCalls ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimestamp(r.lastActivityAt)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/audit/${r.recordId}`}>Audit</Link>
                      </Button>
                      {r.lienKetWikiDichMoi && (
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={r.lienKetWikiDichMoi}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <p>
            Hiển thị {offset + 1}-
            {Math.min(offset + limit, total)} / {total.toLocaleString("vi-VN")}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
            >
              <ChevronLeft className="size-4" /> Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOffset(offset + limit)}
              disabled={offset + limit >= total}
            >
              Sau <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
