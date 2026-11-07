# TypeScript rewrite progress

Living checklist for [SERVER_TS_REWRITE.md](../SERVER_TS_REWRITE.md). Review rules live in [TS_REWRITE_RULES.md](../TS_REWRITE_RULES.md). Update the status line when a slice merges. Keep gameplay changes out of this list until the combat simplification step.

## Where things stand

- Branch: `main`. Workspace setup is on `main` through PR #130. Auth is on `main` through PR #132.
- Side-by-side test: `apps/client` (`@errant/client`, port 5173) calls the C# server at `https://localhost:7135`. `packages/client` (`@errant/client-ts`, port 5174) calls the TypeScript server at `http://localhost:4000`. `packages/server` serves auth on port 4000. `packages/shared` holds the auth request and response types. The C# server stays at `apps/errant-tower-server`. The map editor is `packages/map-editor` (`@errant/map-editor`, Vite port 5175) and is a workspace member.
- `server/ts-rewrite-phase-0` is not the next base. It duplicates the folder move and commits `.vs`, `obj`, and `appsettings.Development.json`. Leave it.

## Decided

Session invalidation: one session id on the user document. The signed cookie carries the user id, that session id, and an expiry. Each authenticated request checks it and slides the 7-day expiry. `POST /auth/sign-out` clears the cookie and rotates the id, which signs out every browser for that user. A separate sessions collection waits until two concurrent sessions are a real need. `GET /auth/session` is the authenticated read the TypeScript client uses on load.

CSRF: JSON-only mutations plus the header `X-Errant-Request: 1`, with the existing CORS allowlist. No token framework.

Combat freeze is decided for the port: do not freeze. Recompute battle stats on each random battle, as `CheckBattle` does now. Revisit only in the combat simplification step.

Port order follows dependencies. A slice does not stub a domain that lands later. Sign-up wires `createInitial` for progress, statistics, and equipment in the slice that adds that domain. Accounts created before that slice have no row for it.

## Checklist

### 1. Workspace

- [x] Root `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, oxlint, oxfmt, `packageManager` pin.
- [x] `apps/client` in the workspace.
- [x] Empty `packages/server` (moved from `apps/server`) and `packages/shared`.
- [x] `packages/client` is a copy of the client, pointed at port 4000. `apps/client` stays pointed at the C# server.
- [x] Map editor is `packages/map-editor`, on the shared tsconfig, oxlint, and oxfmt.
- [ ] Do not revive `server/ts-rewrite-phase-0`.

### 2. Auth slice

Server:

- [x] Fastify app, CORS allowlist from `CORS_ORIGINS`, Mongo from `MONGODB_URI` and `MONGODB_DATABASE`.
- [x] Secrets from the environment. Do not copy values from `appsettings.Development.json`.
- [x] Cookie as specified in the plan (name, HttpOnly, Secure, SameSite `None`, 7-day sliding).
- [x] Session id on the user. Cookie carries user id, session id, and expiry. Sign-out rotates the id.
- [x] `POST /auth/sign-up-start`, `sign-up-complete`, `sign-in-start`, `sign-in-complete`.
- [x] `POST /auth/sign-out`.
- [x] `GET /auth/session` for the client load check. `401` when the cookie is missing, expired, or rotated.
- [x] Reject mutating requests that are not JSON or that omit `X-Errant-Request`.
- [x] Validate bodies at the boundary. Return `{ errors: [{ key, field? }] }`.
- [x] Action codes: 15 minutes, 3 attempts, stored hash. Email through Resend (`RESEND_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME`).
- [x] Sign-up leaves progress, statistics, and equipment uncreated. Those `createInitial` calls stay commented until the domain slice wires them.
- [x] User reads and writes live in a server-only module. No generic repository.

Client:

- [x] `packages/client` sign-up and sign-in pages complete against the TypeScript server. `apps/client` is left on the C# server.
- [x] Sign-out control calls the new route and the protected routes treat a dead cookie as signed out.

Checks:

- [x] Expired action code and a fourth attempt fail.
- [x] Cookie expires, and a rotated session id is rejected.
- [x] A cross-site form post without the header is rejected.

Done when: a new user can sign up and sign in through the UI, reload, and still be authenticated, and sign-out kills that cookie.

### 3. Skill catalog

Static only. No Mongo and no routes.

- [x] Skill types, effects, properties, registry, and the skill data files.
- [x] No HTTP route and no client page in this slice.

Done when: the server can resolve a skill id to its definition, and nothing else in the port depends on a skill stub.

### 4. Combat-stat shape and item catalog

- [x] `BattleStatistics` and the attribute types.
- [x] Item types, the item registry, and the item data.
- [x] No HTTP route and no client page in this slice.

Done when: the server can resolve an item id, including its stat block.

### 5. Statistics document and attributes

- [x] Statistics collection and repository. `createInitial` runs from sign-up completion.
- [x] `get-attributes` and `extend-attribute`.
- [x] The attributes section in `packages/client` calls these routes. `apps/client` stays on the C# server.
- [x] The battle-stat formula is not in this slice.

Done when: a new user gets a statistics row, and the attributes section can read and spend points.

### 6. Equipment

- [x] Equipment collection and repository. `createInitial` runs from sign-up completion, with the same starter bag as the C# insert.
- [x] `get-equipment`, `get-bag`, `equip-item`, and `unequip-item`. Equip checks requirements against the attribute read.
- [x] `AwardItems` writes silver and bag items. Nothing calls it until expedition rewards.
- [x] The equipment section in `packages/client` calls these routes.

Done when: a new user can see the starter bag and equip a piece through the UI.

### 7. Skills and battle statistics

- [x] `get-skill-tree`, `learn-skill`, and `reset-skills`, using the statistics document and the skill catalog.
- [x] `get-battle-statistics` recomputes from attributes, equipped items, and passive skills.
- [x] The skills page and the statistics section in `packages/client` call these routes.

Done when: learning a passive skill changes the battle statistics the character page shows.

### 8. Enemy catalog (next)

- [ ] Enemy types, the enemy registry, and the enemy data. Loot points at item ids. Skills point at skill ids. Stats use `BattleStatistics`.
- [ ] No HTTP route and no client page in this slice.

Done when: the server can resolve an enemy id.

### 9. Floor catalog

- [ ] Floor types, the floor registry, the floor data, and the tile sheets.
- [ ] No HTTP route and no client page in this slice.

Done when: the server can resolve a floor id, including its tiles, enemies, and treasures.

### 10. Progress

- [ ] Progress collection and repository. `createInitial` runs from sign-up completion.
- [ ] `get-floors`, `start-expedition`, and `get-expedition`.
- [ ] Expedition start copies health, mana, and energy maxes and currents from the computed battle stats onto progress.
- [ ] The explore page in `packages/client` calls these routes.

Done when: a signed-in user can open the explore page and start an expedition.

### 11. Battles

- [ ] Battle collection. `Start` and `Get` only. `BattleService.Act` is not ported.
- [ ] `get-battle`.
- [ ] The battle page in `packages/client` calls this route.
- [ ] This slice does not start a battle. Expedition movement does that.

Done when: `get-battle` returns a stored battle in the same shape the C# route returns.

### 12. Expedition movement

Port current behavior only.

- [ ] Socket messages `move`, `moved`, and `error` only. Cookie auth. Persist and drop the session on disconnect.
- [ ] Client refetches expedition after the socket reconnects.
- [ ] Each random battle recomputes combat stats from the live character, equipment, and skills.
- [ ] Battle end does not write resources back (`TODO(#93)` stays).
- [ ] The expedition page in `packages/client` uses this socket. `apps/client` keeps calling the C# server.

Done when: from `packages/client`, a signed-in user can start an expedition, move, enter a random battle, and see the same results the C# server would produce for the same state.

### 13. Focused checks

- [ ] Auth cases from step 2 still pass after later routes land.
- [ ] Combat calculation fixtures compared with the C# results for the same attributes, equipment, and skills.
- [ ] Resource write-back test documents today's behavior, including the missing battle sync.

### 14. Combat simplification (separate)

Blocked until someone writes the rule: do equipment and skill changes affect an expedition that is already running?

- [ ] Gameplay rule recorded in this file.
- [ ] If stats are frozen, persist the full snapshot the battles need, not only resource maxes and currents.
- [ ] Names cleaned up in the files this change touches.

### 15. Remove the old stack

- [ ] C# `apps/errant-tower-server` deleted.
- [ ] Orval, the generated client, and SignalR removed.
- [ ] `apps/client` removed. `packages/client` is the only client and talks only to the TypeScript server.
- [ ] Smoke pass: auth, expedition, battle.

### 16. Absence values

Done before the skills slice. The rule is in `TS_REWRITE_RULES.md`.

- [x] A missing domain value is `null` in documents, responses, entities, and client state. The field is present (`T | null`).
- [x] `undefined` is only a draft field or an optional parameter. `useApiRequest` `data`, `errors`, and `call` use `null`.
- [x] An empty equipment slot is `null` in `equipment-component.tsx`. It does not use `?? undefined`.
- [x] `SessionId` is `string | null`.
- [x] `LearnedSkills` is a required array. An empty list is `[]`.
- [x] A GET `call` takes no argument. Do not pass `undefined`.

## Route inventory (do not grow this during the port)

Auth: `sign-up-start`, `sign-up-complete`, `sign-in-start`, `sign-in-complete`. Sign-out and `GET /auth/session` are new in step 2.

Statistics: `get-attributes`, `get-battle-statistics`, `extend-attribute`, `get-skill-tree`, `learn-skill`, `reset-skills`.

Progress: `get-floors`, `start-expedition`, `get-expedition`.

Equipment: `get-equipment`, `get-bag`, `equip-item`, `unequip-item`.

Battle: `get-battle`. `BattleService.Act` is not ported. The stale current-user route is not ported.

Socket: `/hubs/expedition` is replaced only by the messages in the plan.
