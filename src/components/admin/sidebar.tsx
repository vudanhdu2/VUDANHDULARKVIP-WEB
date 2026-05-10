"use client";

import {
  Activity,
  BookOpen,
  ClipboardList,
  Cog,
  DollarSign,
  GitCompare,
  History,
  LayoutDashboard,
  LogOut,
  Play,
  ScrollText,
  Search,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/records", label: "Records", icon: ClipboardList },
  { href: "/admin/run", label: "Trigger commands", icon: Play },
  { href: "/admin/audit", label: "Audit trail", icon: History },
  { href: "/admin/diff", label: "Diff viewer", icon: GitCompare },
  { href: "/admin/cost", label: "Cost tracker", icon: DollarSign },
  { href: "/admin/glossary", label: "Glossary", icon: ScrollText },
  { href: "/admin/config", label: "Config", icon: Cog },
];

const PUBLIC_LINKS: NavItem[] = [
  { href: "/", label: "Trang chủ", icon: BookOpen },
  { href: "/search", label: "Tìm kiếm", icon: Search },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r bg-card">
      {/* Logo */}
      <div className="px-5 py-5 border-b">
        <Link href="/admin/dashboard" className="block">
          <div className="text-lg font-extrabold leading-none">
            <span className="brand-gradient">VUDANHDULARKVIP</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Activity className="size-3" /> Admin Console
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t" />

        <p className="px-3 text-xs uppercase tracking-wider text-muted-foreground/70 mb-1">
          Public
        </p>
        {PUBLIC_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + theme */}
      <div className="border-t px-3 py-3 space-y-2">
        <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold">
            {(session?.user?.name ?? "?").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">
              {session?.user?.name ?? "Guest"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email ?? "no email"}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="size-3.5" /> Sign out
          </Button>
        </div>
      </div>
    </aside>
  );
}
