import { ComingSoon, PageShell } from "@/components/admin/page-shell";

export const metadata = { title: "Config editor" };

export default function ConfigPage() {
  return (
    <PageShell
      title="Config editor"
      subtitle=".env editor · Hot reload Python V2 settings"
    >
      <ComingSoon
        feature="Settings UI form"
        tier={4}
        description={
          "Tier 4 sẽ implement: form edit .env của V2 (Lark spaces, LLM keys, " +
          "rate limits, cache paths). Validate qua Pydantic Settings schema. " +
          "Trigger reload pipeline workers sau save."
        }
      />
    </PageShell>
  );
}
