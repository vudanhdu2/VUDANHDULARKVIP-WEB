import { ComingSoon, PageShell } from "@/components/admin/page-shell";

export const metadata = { title: "Cost tracker" };

export default function CostPage() {
  return (
    <PageShell
      title="Cost tracker"
      subtitle="LLM tokens + USD per stage · Cache savings"
    >
      <ComingSoon
        feature="Token + USD analytics"
        tier={3}
        description={
          "Tier 3 sẽ implement: aggregate Translate LLM Calls + Cache Hit Pct " +
          "per record → tổng token in/out × giá ($/1M tokens) → USD chart " +
          "theo ngày, theo endpoint, theo model. Cache savings vs baseline."
        }
      />
    </PageShell>
  );
}
