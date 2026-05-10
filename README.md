# VUDANHDULARKVIP-WEB

> Web app cho **[VUDANHDULARKVIP](https://github.com/vudanhdu2/VUDANHDULARKVIP)** — dashboard, control center, public viewer cho pipeline mirror Feishu CN → Larksuite Vietnamese.

## ✨ Features

### 🌐 Public viewer (no auth)

- `/` — Trang chủ với gradient brand + giới thiệu pipeline
- `/docs` — Browse wiki tiếng Việt theo cấu trúc tree
- `/search` — Full-text search Fuse.js client-side
- SEO: Open Graph + JSON-LD + sitemap

### 🛠️ Admin console (GitHub OAuth)

- `/admin/dashboard` — Realtime counters + charts (refetch 5s)
- `/admin/records` — Bảng records: filter/search/paginate, refetch 8s
- `/admin/audit/[id]` — Timeline audit trail per record
- `/admin/run` — Trigger commands + live logs SSE *(Tier 2)*
- `/admin/diff/[id]` — Side-by-side block diff *(Tier 3)*
- `/admin/cost` — LLM tokens + USD analytics *(Tier 3)*
- `/admin/glossary` — CN→VI mappings editor *(Tier 4)*
- `/admin/config` — `.env` editor hot-reload *(Tier 4)*

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│  Browser                                                │
│   ↕ tRPC v11 (type-safe RPC)                           │
└────────────────────────────────────────────────────────┘
                       │
┌──────────────────────┴─────────────────────────────────┐
│  Next.js 16 (App Router + RSC + Turbopack)             │
│   - NextAuth v5 (GitHub OAuth + allowlist)             │
│   - tRPC server + Zod validation                       │
│   - Drizzle ORM (libsql, lazy init)                    │
│   - Tailwind CSS v4 + shadcn/ui (blue + dark mode)     │
│   - TanStack Query (refetch interval cho realtime)     │
└──────────────────────┬─────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
┌─────────────────┐         ┌──────────────────────┐
│ V2 SQLite caches│         │ Python V2 subprocess │
│ (read-only)     │         │ child_process.spawn  │
└─────────────────┘         └──────────────────────┘
```

## 🚀 Quick start

```bash
# 1. Install
pnpm install

# 2. Config — copy .env.example → .env.local rồi fill
cp .env.example .env.local
# Generate NEXTAUTH_SECRET: openssl rand -base64 32

# 3. (Optional) Tạo GitHub OAuth App
# https://github.com/settings/developers → New OAuth App
# Callback URL: http://localhost:3000/api/auth/callback/github
# Fill GITHUB_CLIENT_ID + GITHUB_CLIENT_SECRET vào .env.local

# 4. Run dev server
pnpm dev
# → http://localhost:3000
```

## 📦 Tech stack

| Layer | Library | Version |
|---|---|---|
| Framework | Next.js | 16.2.6 |
| React | React | 19.2.4 |
| Language | TypeScript | 5.9 (strict) |
| API | tRPC | v11 |
| Auth | NextAuth (Auth.js) | v5 beta |
| ORM | Drizzle + libsql | 0.36 / 0.14 |
| UI | Tailwind CSS | v4 |
| Components | shadcn/ui (Radix) | latest |
| State | TanStack Query | v5 |
| Charts | Recharts | 2.x |
| Forms | react-hook-form + Zod | 7.x / 3.x |
| Markdown | react-markdown + shiki | 9.x / 1.x |
| Search | Fuse.js | 7.x |
| Tests | Vitest + Testing Library | 2.x |
| Lint/Format | Biome | 1.9 |

## 🗂️ Cấu trúc thư mục

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Public homepage
│   ├── docs/                     # Public doc reader
│   ├── search/                   # Public search
│   ├── login/                    # Auth login page
│   ├── admin/                    # Admin routes (require auth)
│   │   ├── layout.tsx            # Sidebar layout
│   │   ├── dashboard/            # Counters + charts
│   │   ├── records/              # Records table
│   │   ├── audit/[id]/           # Audit timeline per record
│   │   ├── run/                  # Trigger commands
│   │   ├── diff/                 # Diff viewer
│   │   ├── cost/                 # Cost tracker
│   │   ├── glossary/             # Glossary editor
│   │   └── config/               # Config editor
│   └── api/
│       ├── trpc/[trpc]/          # tRPC HTTP handler
│       └── auth/[...nextauth]/   # NextAuth handler
│
├── components/
│   ├── ui/                       # shadcn/ui base (button, card, badge)
│   ├── admin/                    # Admin-specific
│   ├── providers.tsx             # Theme + Auth + tRPC providers
│   └── theme-toggle.tsx          # Dark mode toggle
│
├── lib/
│   ├── auth.ts                   # NextAuth v5 config
│   ├── db.ts                     # Drizzle clients (lazy init)
│   ├── env.ts                    # Zod env validation
│   ├── trpc-client.ts            # tRPC React client
│   └── utils.ts                  # cn() + formatters
│
├── server/
│   ├── trpc.ts                   # tRPC server config + procedures
│   └── routers/                  # tRPC routers (health, records, ...)
│
├── db/
│   └── schema.ts                 # Drizzle schemas (V2 + web)
│
└── middleware.ts                 # Auth middleware (admin protection)
```

## 🧪 Testing + Quality

```bash
pnpm typecheck    # tsc --noEmit (strict)
pnpm lint         # next lint
pnpm test         # vitest run
pnpm build        # production build
```

## 🗺️ Roadmap

- [x] **Tier 0** — Scaffold (Next.js + tRPC + Auth + Drizzle + UI base)
- [x] **Tier 1** — Admin Sidebar + Dashboard + Records table
- [ ] **Tier 2** — Audit Trail timeline + Trigger commands SSE
- [ ] **Tier 3** — Diff viewer + Cost tracker
- [ ] **Tier 4** — Config editor + Glossary editor
- [ ] **Tier 5** — Public doc reader + Search
- [ ] **Tier 6** — CI + Docker + deploy

## 📜 License

MIT © 2026 VŨ DANH DỰ
