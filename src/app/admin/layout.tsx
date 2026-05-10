import type { PropsWithChildren } from "react";
import { Sidebar } from "@/components/admin/sidebar";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background">{children}</main>
    </div>
  );
}
