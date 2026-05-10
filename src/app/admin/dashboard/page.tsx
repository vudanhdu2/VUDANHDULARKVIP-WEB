import { StageCounters } from "@/components/admin/dashboard/stage-counters";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Tổng quan tiến độ pipeline · Real-time updates mỗi 5 giây
        </p>
      </div>

      <StageCounters />
    </div>
  );
}
