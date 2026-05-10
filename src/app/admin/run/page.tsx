import { ComingSoon, PageShell } from "@/components/admin/page-shell";

export const metadata = { title: "Trigger commands" };

export default function RunPage() {
  return (
    <PageShell
      title="Trigger commands"
      subtitle="Chạy waytoagi crawl / pipeline / mirror / sync / reorder qua UI · Stream live logs SSE"
    >
      <ComingSoon
        feature="Subprocess + SSE stream"
        tier={2}
        description={
          "Tier 2 sẽ implement: spawn child_process.spawn('python', " +
          "['-m', 'waytoagi.cli', 'crawl']), pipe stdout/stderr qua tRPC " +
          "subscription (SSE) → frontend hiển thị realtime ANSI-colored log."
        }
      />
    </PageShell>
  );
}
