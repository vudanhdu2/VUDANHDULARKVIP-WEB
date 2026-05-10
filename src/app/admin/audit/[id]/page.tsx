"use client";

import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Info,
  Loader2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/lib/trpc-client";
import { cn, formatTimestamp } from "@/lib/utils";

interface AuditEvent {
  ts: string;
  stage: string;
  outcome: string;
  details: string;
}

function parseTrail(text: string): AuditEvent[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line): AuditEvent | null => {
      // YYYY-MM-DDTHH:MM:SSZ [STAGE] OUTCOME details
      const match = line.match(/^(\S+)\s+\[(\w+)\]\s+(\w+)\s*(.*)$/);
      if (!match) return null;
      return {
        ts: match[1],
        stage: match[2],
        outcome: match[3],
        details: match[4] ?? "",
      };
    })
    .filter((e): e is AuditEvent => e !== null);
}

function OutcomeIcon({ outcome }: { outcome: string }) {
  if (outcome === "OK") return <CheckCircle2 className="size-4 text-stage-done" />;
  if (outcome === "FAIL") return <XCircle className="size-4 text-stage-failed" />;
  if (outcome === "SKIP") return <AlertCircle className="size-4 text-stage-pending" />;
  if (outcome === "RETRY") return <Clock className="size-4 text-stage-running" />;
  return <Info className="size-4 text-muted-foreground" />;
}

export default function AuditDetailPage() {
  const params = useParams<{ id: string }>();
  const recordId = params.id;

  const { data: record, isLoading } = trpc.records.byId.useQuery({ recordId });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center text-muted-foreground">
        <Loader2 className="size-5 animate-spin mr-2" /> Đang tải...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Không tìm thấy record với ID: <code>{recordId}</code>
            </p>
            <Button variant="outline" asChild className="mt-4">
              <Link href="/admin/records">← Về Records</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const events = parseTrail(record.auditTrail);

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/admin/records">
            <ChevronLeft className="size-4" /> Records
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{record.tieude || record.title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          STT {record.stt} · <code>{record.recordId}</code> · Last activity{" "}
          {formatTimestamp(record.lastActivityAt)}
        </p>
      </div>

      {/* Pipeline overview */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline overview</CardTitle>
          <CardDescription>
            Trạng thái hiện tại + metrics tổng quan
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Stat label="Pipeline Stage" value={record.pipelineStage} />
          <Stat
            label="% Dịch"
            value={record.pctDich !== null ? `${record.pctDich}%` : "—"}
          />
          <Stat
            label="Clone blocks"
            value={record.cloneBlockCount ?? "—"}
          />
          <Stat
            label="LLM calls"
            value={record.translateLlmCalls ?? "—"}
          />
        </CardContent>
      </Card>

      {/* Audit timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>
            {events.length} events · ordered chronologically
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Không có audit events.
            </p>
          ) : (
            <ol className="relative border-l-2 border-border ml-3 space-y-4">
              {events.map((e, i) => (
                <li key={i} className="ml-6">
                  <div
                    className={cn(
                      "absolute -ml-9 mt-1 size-6 rounded-full bg-card border-2 flex items-center justify-center",
                      e.outcome === "OK"
                        ? "border-stage-done"
                        : e.outcome === "FAIL"
                          ? "border-stage-failed"
                          : "border-border",
                    )}
                  >
                    <OutcomeIcon outcome={e.outcome} />
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 ml-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="font-mono">
                        {e.stage}
                      </Badge>
                      <Badge
                        variant={
                          e.outcome === "OK"
                            ? "done"
                            : e.outcome === "FAIL"
                              ? "failed"
                              : "outline"
                        }
                      >
                        {e.outcome}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {e.ts}
                      </span>
                    </div>
                    {e.details && (
                      <p className="text-sm text-muted-foreground font-mono">
                        {e.details}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      {/* Error nếu có */}
      {record.loi && (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <XCircle className="size-5" /> Lỗi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm font-mono bg-destructive/5 p-3 rounded-md overflow-x-auto">
              {record.loi}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="font-medium mt-0.5">{value}</p>
    </div>
  );
}
