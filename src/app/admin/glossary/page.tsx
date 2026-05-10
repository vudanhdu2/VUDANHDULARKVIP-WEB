import { ComingSoon, PageShell } from "@/components/admin/page-shell";

export const metadata = { title: "Glossary editor" };

export default function GlossaryPage() {
  return (
    <PageShell
      title="Glossary editor"
      subtitle="Quản lý CN→VI mappings (people, brands, AI tools, phrases, tech terms)"
    >
      <ComingSoon
        feature="Add/edit/disable glossary entries"
        tier={4}
        description={
          "Tier 4 sẽ implement: CRUD glossary entries, sync với V2 glossary.py. " +
          "Dùng glossary_edits table — preview impact (records nào sẽ re-translate), " +
          "approve workflow trước khi push xuống V2."
        }
      />
    </PageShell>
  );
}
