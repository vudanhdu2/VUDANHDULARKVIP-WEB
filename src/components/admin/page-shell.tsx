"use client";

import { Construction } from "lucide-react";
import type { PropsWithChildren, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PageShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

/**
 * Layout chuẩn cho admin pages — header + actions + content slot.
 */
export function PageShell({
  title,
  subtitle,
  actions,
  children,
}: PropsWithChildren<PageShellProps>) {
  return (
    <div className="container mx-auto px-4 py-6 max-w-[1600px] space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

/**
 * "Coming soon" placeholder — dùng cho skeleton routes Tier 2-5.
 */
export function ComingSoon({
  feature,
  description,
  tier,
}: {
  feature: string;
  description: string;
  tier: number;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Construction className="size-5" />
          </div>
          <div>
            <CardTitle>{feature}</CardTitle>
            <CardDescription>
              Skeleton route · Tier {tier} sẽ wire-up đầy đủ
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
