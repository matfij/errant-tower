# Errant Tower Server: C# → TypeScript Migration Plan

**Goal**: Migrate the C# ASP.NET Core backend to TypeScript while aligning tooling with the frontend and the `space-scheme` project. Keep MongoDB with a loose coupling (easy future move to Postgres). Data loss is acceptable (prototype).

## Current State

### errant-tower
- `apps/errant-tower-client` — React 19 + Vite + Zustand + React Query + SignalR + Orval (OpenAPI-generated client). Already uses oxlint, oxfmt, TypeScript 7.
- `apps/errant-tower-server` — ASP.NET Core (.NET 10) + MongoDB.Driver + cookie auth + Swagger + SignalR (expeditions) + Resend.
  - Structure: Domains (Users, Battles, Equipments, Expeditions, Floors, Items, Progresses, Skills, Statistics) + Orchestrator (controllers + DTOs) + Common.
- `apps/map-editor`

### space-scheme (tooling reference)
- Clean pnpm workspace (`apps/*` + `packages/*`)
- Root: `package.json` (oxlint/oxfmt/typescript + packageManager pin), `tsconfig.base.json`, `.oxlintrc.json`, `.oxfmtrc.json`
- `packages/shared` exporting entities, DTOs, config, utils (consumed by client + server via `workspace:*`)
- Server: Fastify + tsx
- Consistent scripts and strict TypeScript

## Target Architecture

```
errant-tower/
├── package.json                  # root scripts + packageManager
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .oxlintrc.json
├── .oxfmtrc.json
├── packages/
│   └── shared/                   # @errant/shared
│       ├── src/
│       │   ├── entities.ts
│       │   ├── combat.ts
│       │   ├── dtos.ts
│       │   ├── repository.ts
│       │   └── index.ts
│       └── package.json
└── apps/
    ├── client/                   # existing errant-tower-client (moved)
    └── server/                   # new Fastify TS server
```

### Key Decisions

| Concern              | Recommendation                              | Rationale |
|----------------------|---------------------------------------------|-----------|
| Monorepo             | Full pnpm workspace (match space-scheme)    | Type sharing + tooling alignment |
| Shared types         | `@errant/shared` (entities + derived types) | Single source of truth, no codegen |
| Backend framework    | Fastify + tsx                               | Matches space-scheme, lightweight |
| MongoDB coupling     | Official `mongodb` driver + repository interfaces | Easy to swap for Postgres later |
| Validation           | Zod (optional, co-located with types)       | Runtime + type safety |
| Auth                 | `@fastify/cookie` + signed cookies          | Direct port of current cookie auth |
| Real-time            | `@fastify/websocket`                        | Replace SignalR hub |
| Email                | Resend Node SDK                             | Drop-in |
| API client           | Drop Orval; import from `@errant/shared`    | Eliminate OpenAPI codegen cycle |
| Tooling              | Same oxlint / oxfmt / tsconfig / pnpm as space-scheme | Consistency |

## TypeScript Advantages to Leverage

### Flexible typing (avoid literal property mapping)

Entities are the source of truth. Derive everything else with utility types:

```ts
export interface Character {
  id: string;
  userId: string;
  attributePoints: number;
  skillPoints: number;
  strength: number;
  dexterity: number;
  constitution: number;
  spirit: number;
  learnedSkills: LearnedSkill[];
}

export type CreateCharacter = Omit<Character, "id">;
export type UpdateCharacter = Partial<Pick<Character, "username" | "isConfirmed">>;
export type CharacterPublic = Omit<Character, "actionCodeHash" | "actionCodeExpiresAt">;
```

Compositional object types (intersections, spreads of type aliases) replace the current C# style of separate classes + manual mapping in orchestrators.

### Flexible repository querying by any field

```ts
export interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  findOne(filter: Partial<T>): Promise<T | null>;          // any subset of fields
  findMany(filter: Partial<T>, options?: FindOptions): Promise<T[]>;
  create(data: Omit<T, "id">): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
```

Mongo implementation passes the `Partial<T>` (or richer filter) straight through. No per-entity query methods required for the common case. Later Postgres implementation keeps the same interface.

## Statistics & Expedition Simplification

### Current pain points
- Naming overload: `StatisticsEntity` (permanent attributes + skills) vs `BattleStatistics` (computed combat snapshot) vs resource fields copied into `ProgressEntity`.
- Scattered responsibility: calculation in `StatisticsService`, snapshot in `ProgressService.StartExpedition`, re-computation on every random battle in `ExpeditionService.CheckBattle`.
- Live resources stored in two places (`ProgressEntity` + `BattleEntity`) with unclear write-back (battle sync is still a TODO).
- Skills mixed into the Statistics domain.
- Lots of manual property-by-property mapping and large switch statements.

### Proposed streamlined model

**Clearer names (in `@errant/shared`)**:

```ts
/** Permanent character progression (persisted) */
export interface Character { /* attributes, points, learnedSkills */ }

/** Derived combat snapshot (computed, not persisted as-is) */
export interface CombatStats {
  speed: number;
  maxHealth: number;
  health: number;          // current
  maxMana: number;
  mana: number;
  maxEnergy: number;
  energy: number;
  physicalAttack: number;
  // ... remaining combat fields
}

/** Live mutable resources during an expedition */
export type ResourcePools = Pick<CombatStats, "health" | "mana" | "energy">;
export type ResourceMaxes = Pick<CombatStats, "maxHealth" | "maxMana" | "maxEnergy">;
```

**Single computation + snapshot at expedition start**:
- Compute `CombatStats` **once** when the expedition starts (attributes + current equipment + passive skills).
- Store maxes + current resources on the expedition/progress document.
- Do **not** recompute full stats on every random battle; just clone the current live resources into the battle.

**Battle uses a live clone, then writes back in one place**:
- On battle start: clone current live resources into `BattleEntity`.
- On battle end: write remaining resources back to the expedition state in a single update.

**TypeScript helpers that remove boilerplate**:

```ts
export function applyModifiers(stats: CombatStats, modifiers: SkillProperty[]): CombatStats { /* ... */ }
export function updateResources(stats: CombatStats, updates: Partial<ResourcePools>): CombatStats {
  return { ...stats, ...updates };
}
```

### Resulting organization

| Concern                        | Where it lives                  | Notes |
|--------------------------------|---------------------------------|-------|
| Permanent attributes + skills  | `Character` document            | Renamed from `StatisticsEntity` |
| Combat calculation             | Pure function `computeCombatStats` | Called once at expedition start |
| Live resources during expedition | Fields on Progress / session  | Single source of truth |
| Battle                         | Holds a clone of `CombatStats`  | Writes remaining resources back on finish |
| Skill tree logic               | Thin service next to Character  | No longer mixed into “statistics” |

## Migration Phases

**Phase 0 – Prep**
1. Create root `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `.oxlintrc.json`, `.oxfmtrc.json` (adapted from space-scheme).
2. Move `apps/errant-tower-client` → `apps/client` and wire into the workspace.
3. Create empty `packages/shared` and `apps/server`.

**Phase 1 – Shared Types**
1. Port domain entities, DTOs, and enums into `packages/shared`.
2. Add derived types (`Create*`, `Update*`, `Public*`, `CombatStats`, `ResourcePools`, generic `Repository<T>`).
3. Optional: co-located Zod schemas.

**Phase 2 – Server Skeleton**
1. Fastify app with cookie auth, CORS, WebSocket plugin, error handling.
2. Mongo client singleton + index creation on startup.
3. Generic repository base + Mongo implementations.

**Phase 3 – Domain-by-Domain Port**
Order (bottom-up):
1. Users (auth + email via Resend)
2. Character / Attributes / Skills (replaces Statistics domain)
3. Equipments / Items
4. Progress / Expeditions (with simplified combat snapshot)
5. Battles
6. Floors / Enemies (mostly static data)

**Phase 4 – Client Switchover**
1. Remove Orval and generated client.
2. Import types from `@errant/shared`.
3. Replace generated hooks with thin React Query wrappers.
4. Update SignalR client to the new WebSocket protocol.

**Phase 5 – Cleanup**
- Delete the entire C# `apps/errant-tower-server`.
- Align remaining scripts, engines, and CI.
- Recreate Mongo indexes and any seed data.
- Smoke-test auth, expeditions, and a full play loop.

## Database Abstraction (future Postgres)

Keep the exact same `Repository<T>` interface and `Partial<T>` query style. Only the implementation class changes (Drizzle or Prisma will accept similar filters).

## Tooling Alignment Checklist
- [ ] Root `packageManager` + `devEngines` matching space-scheme
- [ ] Same oxlint + oxfmt configs
- [ ] `tsconfig.base.json` extended by all packages
- [ ] Workspace protocol dependencies (`workspace:*`)
- [ ] Consistent scripts: `lint`, `format`, `start`, `build`

---

This plan keeps the migration small, type-safe, and aligned with the existing frontend/space-scheme stack while leaving a clean escape hatch to Postgres and simplifying the most tangled domain (statistics + expeditions).
