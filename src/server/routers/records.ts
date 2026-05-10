/**
 * Records router — query Lark Base records.
 *
 * Strategy:
 *   - Khi LARK_APP_ID + LARK_APP_SECRET cấu hình → fetch trực tiếp Lark API
 *   - Khi chưa cấu hình → trả mock data để UI dev được offline
 *
 * Wire-up real Lark Base: dùng `larkBaseClient` (sẽ implement ở
 * Tier sau khi user cấu hình credentials).
 */

import { z } from "zod";
import { env } from "@/lib/env";
import { adminProcedure, router } from "../trpc";

/* ============================================================ */
/* Types — match V2 BaseRecord schema                            */
/* ============================================================ */

export const PipelineStageEnum = z.enum([
  "Pending",
  "Crawling",
  "Placeholder",
  "Cloning",
  "Translating",
  "Mirroring",
  "Syncing",
  "Reordering",
  "Done",
  "Failed",
]);

export const RecordSchema = z.object({
  recordId: z.string(),
  stt: z.number().nullable(),
  title: z.string(),
  tieude: z.string(),
  nodeToken: z.string(),
  pipelineStage: PipelineStageEnum,
  trangThai: z.string(),
  trangThaiDich: z.string(),
  mirrorWikiNodeToken: z.string(),
  mirrorWikiStatus: z.string(),
  lienKetClone: z.string(),
  lienKetDich: z.string(),
  lienKetWikiDichMoi: z.string(),
  pctDich: z.number().nullable(),
  cloneBlockCount: z.number().nullable(),
  translateBlockCount: z.number().nullable(),
  cloneDurationSeconds: z.number().nullable(),
  translateDurationSeconds: z.number().nullable(),
  translateLlmCalls: z.number().nullable(),
  translateCacheHitPct: z.number().nullable(),
  loi: z.string(),
  auditTrail: z.string(),
  lastActivityAt: z.number().nullable(),
});

export type RecordRow = z.infer<typeof RecordSchema>;

/* ============================================================ */
/* Mock data — dùng khi Lark chưa cấu hình                       */
/* ============================================================ */

function mockRecords(count: number): RecordRow[] {
  const stages: Array<RecordRow["pipelineStage"]> = [
    "Done",
    "Done",
    "Done",
    "Translating",
    "Cloning",
    "Mirroring",
    "Pending",
    "Failed",
    "Placeholder",
  ];
  const titles = [
    "通往AGI之路",
    "Prompt 工程入门",
    "AI 工具导航",
    "飞书自动化教程",
    "深度学习实战",
    "大模型微调指南",
    "陈财猫: Prompt-Top100",
    "南瓜博士: 深度拆解...",
    "DeepSeek 详解",
    "ChatGPT 进阶",
  ];
  const viTitles = [
    "Con đường tới AGI",
    "Nhập môn kỹ thuật prompt",
    "Danh bạ công cụ AI",
    "Hướng dẫn tự động hoá Feishu",
    "Học sâu thực chiến",
    "Hướng dẫn fine-tune mô hình lớn",
    "Trần Tài Mèo: Top 100 prompt",
    "Tiến sĩ Bí Ngô: Phân tích sâu...",
    "Phân tích chi tiết DeepSeek",
    "ChatGPT nâng cao",
  ];
  const now = Date.now();

  return Array.from({ length: count }, (_, i) => {
    const stage = stages[i % stages.length];
    const titleIdx = i % titles.length;
    return {
      recordId: `rec_${String(i + 1).padStart(6, "0")}`,
      stt: i + 1,
      title: titles[titleIdx],
      tieude: viTitles[titleIdx],
      nodeToken: `CN${i.toString(16).padStart(20, "0")}`,
      pipelineStage: stage,
      trangThai: stage === "Done" ? "Done" : stage === "Failed" ? "Failed" : "Pending",
      trangThaiDich: stage === "Done" ? "Done" : "Pending",
      mirrorWikiNodeToken:
        stage === "Pending" ? "" : `DST${i.toString(16).padStart(20, "0")}`,
      mirrorWikiStatus:
        stage === "Done" ? "Synced" : stage === "Failed" ? "Failed" : "Placeholder",
      lienKetClone:
        stage === "Pending" || stage === "Placeholder"
          ? ""
          : `https://vudanhdu.sg.larksuite.com/wiki/CLONE_${i}`,
      lienKetDich:
        stage === "Done" || stage === "Mirroring" || stage === "Syncing"
          ? `https://vudanhdu.sg.larksuite.com/wiki/VI_${i}`
          : "",
      lienKetWikiDichMoi: `https://vudanhdu.sg.larksuite.com/wiki/DST_${i}`,
      pctDich: stage === "Done" ? 100 : stage === "Translating" ? 45 : null,
      cloneBlockCount: stage === "Done" ? 247 + (i % 100) : null,
      translateBlockCount: stage === "Done" ? 198 + (i % 80) : null,
      cloneDurationSeconds: stage === "Done" ? 32.5 + (i % 30) : null,
      translateDurationSeconds: stage === "Done" ? 132.3 + (i % 60) : null,
      translateLlmCalls: stage === "Done" ? 7 + (i % 5) : null,
      translateCacheHitPct: stage === "Done" ? Math.min(80, 8 + i * 0.3) : null,
      loi: stage === "Failed" ? "STAGE1-PERM-DENIED: 131006" : "",
      auditTrail: [
        `2026-05-12T06:01:${String((i % 59) + 1).padStart(2, "0")}Z [CRAWL] OK n=${i}`,
        stage !== "Pending"
          ? `2026-05-12T06:0${(i % 9) + 2}:18Z [PLACEHOLDER] OK dst=DST_${i}`
          : "",
        ["Cloning", "Translating", "Done", "Mirroring"].includes(stage)
          ? `2026-05-12T06:35:42Z [CLONE] OK dt=39.2s count=247`
          : "",
        stage === "Done"
          ? `2026-05-12T06:36:34Z [TRANSLATE] OK dt=132.3s calls=7`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
      lastActivityAt: now - i * 60_000,
    };
  });
}

/* ============================================================ */
/* Router                                                        */
/* ============================================================ */

export const recordsRouter = router({
  /** Liệt kê records — paginate + filter theo stage. */
  list: adminProcedure
    .input(
      z.object({
        stage: PipelineStageEnum.optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ input }) => {
      const e = env();
      const useMock = !e.LARK_APP_ID || !e.LARK_APP_SECRET;

      // TODO Tier sau: implement Lark Base proxy fetcher
      const all = useMock ? mockRecords(150) : mockRecords(150);

      let filtered = all;
      if (input.stage) {
        filtered = filtered.filter((r) => r.pipelineStage === input.stage);
      }
      if (input.search) {
        const q = input.search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.tieude.toLowerCase().includes(q) ||
            r.nodeToken.toLowerCase().includes(q),
        );
      }

      const total = filtered.length;
      const items = filtered.slice(input.offset, input.offset + input.limit);

      return { items, total, useMock };
    }),

  /** Get 1 record by ID. */
  byId: adminProcedure
    .input(z.object({ recordId: z.string() }))
    .query(async ({ input }) => {
      const all = mockRecords(150);
      return all.find((r) => r.recordId === input.recordId) ?? null;
    }),

  /** Counters by Pipeline Stage cho dashboard. */
  stageCounters: adminProcedure.query(async () => {
    const all = mockRecords(150);
    const counters: { [stage: string]: number } = {};
    for (const stage of [
      "Pending",
      "Crawling",
      "Placeholder",
      "Cloning",
      "Translating",
      "Mirroring",
      "Syncing",
      "Reordering",
      "Done",
      "Failed",
    ]) {
      counters[stage] = all.filter((r) => r.pipelineStage === stage).length;
    }
    return { total: all.length, counters };
  }),
});
