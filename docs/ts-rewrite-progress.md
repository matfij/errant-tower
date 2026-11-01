# TypeScript rewrite progress

Living checklist for [SERVER_TS_REWRITE.md](../SERVER_TS_REWRITE.md). Update the status line when a slice merges. Keep gameplay changes out of this list until step 5.

## Where things stand

- Branch: `main`, through PR #129 (`chore: prepare the TypeScript pnpm workspace`).
- Side-by-side test: `apps/client` (`@errant/client`, port 5173) calls the C# server at `https://localhost:7135`. `packages/client` (`@errant/client-ts`, port 5174) calls the TypeScript server at `http://localhost:4000`. `packages/server` is the moved empty server (`src/index.ts` is `export {}`). `packages/shared` is still empty. The C# server stays at `apps/errant-tower-server`. The map editor stays at `apps/map-editor`, outside the workspace.
- `server/ts-rewrite-phase-0` is not the next base. It duplicates the folder move and commits `.vs`, `obj`, and `appsettings.Development.json`. Leave it.

## Decided

Session invalidation: one session id on the user document. The signed cookie carries the user id and that session id. Each authenticated request checks it. `POST /auth/sign-out` clears the cookie and rotates the id, which signs out every browser for that user. A separate sessions collection waits until two concurrent sessions are a real need.

CSRF: JSON-only mutations plus the header `X-Errant-Request: 1`, with the existing CORS allowlist. No token framework.

Combat freeze is decided for the port: do not freeze. Recompute battle stats on each random battle, as `CheckBattle` does now. Revisit only in step 5.

## Checklist

### 1. Workspace

- [x] Root `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, oxlint, oxfmt, `packageManager` pin.
- [x] `apps/client` in the workspace.
- [x] Empty `packages/server` (moved from `apps/server`) and `packages/shared`.
- [x] `packages/client` is a copy of the client, pointed at port 4000. `apps/client` stays pointed at the C# server.
- [x] Map editor stays outside the workspace.
- [ ] Do not revive `server/ts-rewrite-phase-0`.

### 2. Auth slice (next)

Server:

- [ ] Fastify app, CORS allowlist from `CORS_ORIGINS`, Mongo from `MONGODB_URI` and `MONGODB_DATABASE`.
- [ ] Secrets from the environment. Do not copy values from `appsettings.Development.json`.
- [ ] Cookie as specified in the plan (name, HttpOnly, Secure, SameSite `None`, 7-day sliding).
- [ ] Session id on the user. Cookie carries user id plus session id. Sign-out rotates the id.
- [ ] `POST /auth/sign-up-start`, `sign-up-complete`, `sign-in-start`, `sign-in-complete`.
- [ ] `POST /auth/sign-out`.
- [ ] Reject mutating requests that are not JSON or that omit `X-Errant-Request`.
- [ ] Validate bodies at the boundary. Return `{ errors: [{ key, field? }] }`.
- [ ] Action codes: 15 minutes, 3 attempts, stored hash. Email through Resend (`RESEND_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME`).
- [ ] Sign-up completion still creates the initial progress, statistics, and equipment rows. Those creators can be thin ports of the C# inserts. Do not port the rest of those domains here.
- [ ] User reads and writes live in a server-only module. No generic repository.

Client:

- [ ] `packages/client` sign-up and sign-in pages complete against the TypeScript server. `apps/client` is left on the C# server.
- [ ] Sign-out control calls the new route and the protected routes treat a dead cookie as signed out.

Checks:

- [ ] Expired action code and a fourth attempt fail.
- [ ] Cookie expires, and a rotated session id is rejected.
- [ ] A cross-site form post without the header is rejected.

Done when: a new user can sign up and sign in through the UI, reload, and still be authenticated, and sign-out kills that cookie.

### 3. Expedition and battle loop

Port current behavior only.

- [ ] Routes used by that loop: start expedition, get expedition, get battle, and the data they read (progress, statistics, equipment, skills, static floors and enemies).
- [ ] Socket messages `move`, `moved`, and `error` only. Cookie auth. Persist and drop the session on disconnect.
- [ ] Client refetches expedition after the socket reconnects.
- [ ] Expedition start copies resource maxes and currents onto progress.
- [ ] Each random battle recomputes combat stats from the live character, equipment, and skills.
- [ ] Battle end does not write resources back (`TODO(#93)` stays).
- [ ] Shared types are the request and response fields this loop actually sends. Persistence stays in `packages/server`.
- [ ] `packages/client` calls the TypeScript server for this loop. `apps/client` keeps calling the C# server.

Done when: from the existing client, a signed-in user can start an expedition, move, enter a random battle, and see the same results the C# server would produce for the same state.

### 4. Focused checks

- [ ] Auth cases from step 2 still pass after later routes land.
- [ ] Combat calculation fixtures compared with the C# results for the same attributes, equipment, and skills.
- [ ] Resource write-back test documents today's behavior, including the missing battle sync.

### 5. Combat simplification (separate)

Blocked until someone writes the rule: do equipment and skill changes affect an expedition that is already running?

- [ ] Gameplay rule recorded in this file.
- [ ] If stats are frozen, persist the full snapshot the battles need, not only resource maxes and currents.
- [ ] Names cleaned up in the files this change touches.

### 6. Remove the old stack

- [ ] C# `apps/errant-tower-server` deleted.
- [ ] Orval, the generated client, and SignalR removed.
- [ ] `apps/client` removed. `packages/client` is the only client and talks only to the TypeScript server.
- [ ] Smoke pass: auth, expedition, battle.

## Route inventory (do not grow this during the port)

Auth: `sign-up-start`, `sign-up-complete`, `sign-in-start`, `sign-in-complete`. Sign-out is new in step 2.

Statistics: `get-attributes`, `get-battle-statistics`, `extend-attribute`, `get-skill-tree`, `learn-skill`, `reset-skills`.

Progress: `get-floors`, `start-expedition`, `get-expedition`.

Equipment: `get-equipment`, `get-bag`, `equip-item`, `unequip-item`.

Battle: `get-battle`. `BattleService.Act` is not ported. The stale current-user route is not ported.

Socket: `/hubs/expedition` is replaced only by the messages in the plan.
