"use client";

import { Loader2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/lib/trpc-client";
import { cn } from "@/lib/utils";

const STAGE_COLORS: Record<string, string> = {
  Pending: "var(--stage-pending)",
  Crawling: "var(--stage-running)",
  Placeholder: "var(--stage-running)",
  Cloning: "var(--stage-running)",
  Translating: "var(--stage-running)",
  Mirroring: "var(--stage-running)",
  Syncing: "var(--stage-running)",
  Reordering: "var(--stage-running)",
  Done: "var(--stage-done)",
  Failed: "var(--stage-failed)",
};

export function StageCounters() {
  const { data, isLoading, error } = trpc.records.stageCounters.useQuery(
    undefined,
    {
      refetchInterval: 5000, // realtime update mỗi 5s
    },
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center text-muted-foreground">
          <Loader2 className="size-5 animate-spin mr-2" /> Đang tải...
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-destructive">
          Lỗi tải dữ liệu: {error?.message ?? "unknown"}
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.entries(data.counters).map(([stage, count]) => ({
    stage,
    count: count as number,
    color: STAGE_COLORS[stage] ?? "var(--muted)",
  }));

  const done = data.counters.Done ?? 0;
  const failed = data.counters.Failed ?? 0;
  const inProgress =
    data.total - done - failed - (data.counters.Pending ?? 0);

  return (
    <div className="space-y-4">
      {/* Top stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Tổng records"
          value={data.total.toLocaleString("vi-VN")}
          accent="text-primary"
        />
        <StatCard
          label="Done"
          value={done.toLocaleString("vi-VN")}
          accent="text-stage-done"
          subtitle={`${((done / data.total) * 100).toFixed(1)}%`}
        />
        <StatCard
          label="Đang xử lý"
          value={inProgress.toLocaleString("vi-VN")}
          accent="text-stage-running"
        />
        <StatCard
          label="Failed"
          value={failed.toLocaleString("vi-VN")}
          accent="text-stage-failed"
          subtitle={
            failed > 0
              ? `${((failed / data.total) * 100).toFixed(1)}%`
              : undefined
          }
        />
      </div>

      {/* Bar chart */}
      <Card>
        <CardHeader>
          <CardTitle>Phân phối theo stage</CardTitle>
          <CardDescription>
            Cập nhật mỗi 5 giây · Tổng {data.total.toLocaleString("vi-VN")} records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="stage"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--popover-foreground)",
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((d) => (
                    <Cell key={d.stage} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Stage badges */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết per stage</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {chartData.map((item) => (
            <Badge
              key={item.stage}
              variant={
                item.stage === "Done"
                  ? "done"
                  : item.stage === "Failed"
                    ? "failed"
                    : item.stage === "Pending"
                      ? "pending"
                      : "running"
              }
              className="text-sm py-1.5 px-3"
            >
              {item.stage}: <span className="ml-1 font-bold">{item.count}</span>
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  subtitle,
}: {
  label: string;
  value: string;
  accent?: string;
  subtitle?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
          {label}
        </p>
        <p className={cn("text-2xl font-bold", accent)}>{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
