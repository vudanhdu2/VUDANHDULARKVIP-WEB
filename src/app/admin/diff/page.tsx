import { ComingSoon, PageShell } from "@/components/admin/page-shell";

export const metadata = { title: "Diff viewer" };

export default function DiffPage() {
  return (
    <PageShell
      title="Diff viewer"
      subtitle="So sánh src CN vs dst VI block-by-block · Verify quality manually"
    >
      <ComingSoon
        feature="Side-by-side block diff"
        tier={3}
        description={
          "Tier 3 sẽ implement: gọi V2 SyncStage.compute_diff qua subprocess, " +
          "render side-by-side với syntax highlight (shiki) cho code blocks, " +
          "highlight blocks REPLACE/APPEND/DELETE/KEEP với màu sắc."
        }
      />
    </PageShell>
  );
}
