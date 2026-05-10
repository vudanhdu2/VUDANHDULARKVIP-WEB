import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VUDANHDULARKVIP — Wiki tiếng Việt",
    template: "%s · VUDANHDULARKVIP",
  },
  description:
    "Mirror Feishu CN wiki sang Larksuite Vietnamese — async pipeline " +
    "với resilience layer (clone + translate + sync).",
  keywords: [
    "lark",
    "feishu",
    "wiki",
    "translation",
    "vietnamese",
    "agi",
    "ai",
  ],
  authors: [{ name: "VŨ DANH DỰ" }],
  creator: "VŨ DANH DỰ",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    title: "VUDANHDULARKVIP — Wiki tiếng Việt",
    description: "Wiki AI/AGI dịch sang tiếng Việt từ nguồn Feishu CN.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${beVietnamPro.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
