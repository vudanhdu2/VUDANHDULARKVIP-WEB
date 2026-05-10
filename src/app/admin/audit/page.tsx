import { ComingSoon, PageShell } from "@/components/admin/page-shell";

export const metadata = { title: "Audit trail" };

export default function AuditIndexPage() {
  return (
    <PageShell
      title="Audit trail"
      subtitle="Timeline events per record · Click record từ trang Records để xem chi tiết"
    >
      <ComingSoon
        feature="Event timeline viewer"
        tier={2}
        description={
          "Parse Audit Trail field từ Lark Base — render timeline " +
          "chronological mỗi event [STAGE] OK/FAIL với duration + metrics."
        }
      />
    </PageShell>
  );
}
