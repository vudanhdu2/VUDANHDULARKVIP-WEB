import { RecordsTable } from "@/components/admin/records/records-table";

export const metadata = {
  title: "Records",
};

export default function RecordsPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-[1600px] space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Records</h1>
        <p className="text-muted-foreground mt-1">
          Bảng các records từ Lark Base — filter, search, xem audit trail.
        </p>
      </div>

      <RecordsTable />
    </div>
  );
}
