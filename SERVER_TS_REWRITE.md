# Errant Tower server: TypeScript migration

Move the C# ASP.NET server to TypeScript. Keep MongoDB, the current HTTP behavior, and the current gameplay. This is a low-traffic hobby project, so each step is the smallest change that makes one flow work.

Workspace setup is already on `main` (PR #129): pnpm, root oxlint / oxfmt / TypeScript, and `packages/shared`. The side-by-side test keeps two stacks:

- `apps/client` (`@errant/client`, Vite port 5173) calls the C# server at `https://localhost:7135`.
- `packages/client` (`@errant/client-ts`, Vite port 5174) calls the TypeScript server at `http://localhost:4000`.
- The TypeScript server package is `packages/server`. It listens on port 4000 and serves auth, attributes, equipment, the skill tree, battle statistics, expeditions, and battles.
- The C# server stays at `apps/errant-tower-server`.
- The map editor is `packages/map-editor` (`@errant/map-editor`, Vite port 5175). It is a workspace member and uses the shared tsconfig, oxlint, and oxfmt.

Do not merge `server/ts-rewrite-phase-0`. That branch commits IDE output, build output, and `appsettings.Development.json`.

Progress lives in [docs/ts-rewrite-progress.md](docs/ts-rewrite-progress.md). Review rules live in [TS_REWRITE_RULES.md](TS_REWRITE_RULES.md). Update that file when new feedback lands.

## Keep

- The pnpm workspace and shared tooling already on `main`.
- Fastify and tsx in `packages/server`, listening on port 4000.
- The existing MongoDB database and the official `mongodb` driver. Database calls stay in small server-only modules.
- Shared API contracts and pure combat functions in `packages/shared`, added when a feature needs them.
- Clear names when a file is touched: permanent progression, combat stats, and current resources.
- The 18 HTTP routes. JSON stays camelCase. Enums stay strings on the wire. Errors stay `{ errors: [{ key, field? }] }`.
- Cookie name `errant_tower_auth`.
- Resend for the existing action-code emails.

## Out of scope

These wait until a concrete need shows up:

- Postgres, a repository interface, or any promise that MongoDB queries can be reused as SQL.
- A generic `Repository<T>`. `Partial<T>` is not a query language.
- Porting every entity and DTO before a route needs it.
- Deriving public responses or writable requests with `Omit`, `Partial`, or `Pick` from the stored document.
- Renaming the statistics model, or freezing combat stats for an expedition.
- Battle resource write-back. `BattleService` still has `TODO(#93)`. The port keeps that gap.
- Deleting the C# server, Orval, or SignalR before the replacement flow works.
- tRPC, ts-rest, and oRPC.

## Contracts

A public response and a writable request each list the fields they allow. A TypeScript type does not remove extra JSON fields and does not validate input.

Validate every HTTP and WebSocket body at the trust boundary. Zod is fine. A hand-written check is fine. Skipping validation is not.

Persistence types and database helpers stay in `packages/server`. `packages/shared` holds only types and pure functions that a ported route already uses from both sides.

The old examples were wrong. `username` and `isConfirmed` belong to the user document, not to a character built from attributes and skills. Omitting fields that are not on the source type does not define a public contract.

## Authentication

Match the current cookie, then close the gaps in the auth slice.

The C# cookie in `Program.cs` is:

- Name `errant_tower_auth`.
- HttpOnly, `Secure` always, `SameSite=None` (the client and the API are different sites).
- Persistent, with a 7-day sliding expiry.
- Payload is the user id.
- Set on `POST /auth/sign-up-complete` and `POST /auth/sign-in-complete`.

There is no logout route and no server-side session. A copied cookie stays valid until it expires. There is no CSRF token.

Action codes stay as they are: 15-minute expiry, 3 attempts, hash stored on the user.

Session invalidation: store one session id on the user. The signed cookie carries the user id, that session id, and an expiry. Each authenticated request checks both ids and the expiry, then refreshes the expiry and the cookie max-age (7-day sliding window). `POST /auth/sign-out` clears the cookie and rotates the id, which signs out every browser for that user.

`GET /auth/session` returns `{ userId, username }` for a valid cookie and `401` otherwise. The TypeScript client calls it on load. A `401` clears the local user, so protected pages treat a dead cookie as signed out.

CSRF, given `SameSite=None`: mutating routes accept `application/json` only and require the header `X-Errant-Request: 1`, so the browser preflights and the CORS allowlist applies. The WebSocket upgrade uses the same cookie and the same origin allowlist. No antiforgery package.

## Realtime

Replace SignalR with the messages the hub already has. One module, `expedition-hub`. No general socket layer.

| Direction        | Message | Body                                                |
| ---------------- | ------- | --------------------------------------------------- |
| Client to server | `move`  | `{ direction }` using Up=1, Down=2, Left=3, Right=4 |
| Server to client | `moved` | `{ x, y, initiative, battleId? }`                   |
| Server to client | `error` | `{ key }`                                           |

The socket requires the same session cookie. A missing or dead session closes the connection.

On disconnect, persist the in-memory expedition and drop it, as `ExpeditionHub.OnDisconnectedAsync` does today.

On reconnect, the server does not replay state. The client loads `GET` expedition again. The page already does that on mount. The port also does it after reconnect. The current SignalR client reconnects and does not refetch.

## Combat behavior to preserve

At expedition start, store the computed battle statistics on the expedition document. `statistics` is null before a run. Do not store separate health, mana, and energy fields. `get-expedition` returns that object as `statistics`.

On each random battle, recompute battle stats from the live character, current equipment, and active skills. The stored statistics are the expedition's resource snapshot. Battles do not read the attack fields from it yet.

Equipment and skill changes during an expedition affect the next battle. That is what `ExpeditionService.CheckBattle` does today.

A later change may freeze a full combat snapshot. That needs an explicit gameplay rule, and it is a separate step after the loop is ported.

Battle completion does not write resources back to the expedition (`TODO(#93)`).

## Database access

One small module per domain that is being ported, with the operations that route needs (`findUserByEmail`, `updateExpedition`, and so on). Name the fields in the filter. Extract a shared helper only after the same code appears twice.

## Sequence

Build up from modules that do not need the rest of the game. A slice lands only when every call it makes already exists. Do not add a temporary stub for a domain that comes later.

1. Workspace. Done on `main`.
2. Auth slice. Done on `main` (PR #132). Fastify on port 4000, MongoDB, the cookie session, the auth routes, boundary validation, and the sign-in and sign-up pages in `packages/client`. That client talks only to the TypeScript server. `apps/client` stays on the C# server. Sign-up does not create expedition, statistics, or equipment yet. Each of those domains wires its own `createInitial` when it lands.
3. Skill catalog. Static skill types, effects, the registry, and the data files. No Mongo and no routes. Nothing else in the server imports this until a later slice.
4. Combat-stat shape and the item catalog. `BattleStatistics`, attribute types, and the item registry. An item stores a stat block and nothing else. No routes.
5. Statistics document and attributes. The statistics collection, `createInitial` from sign-up, `get-attributes`, and `extend-attribute`. The attributes section in `packages/client` calls these routes. The battle-stat formula stays out: it reads equipped items and passive skills.
6. Equipment. Needs the item catalog and the attribute read. `createInitial` from sign-up, `get-equipment`, `get-bag`, `equip-item`, and `unequip-item`. `AwardItems` lands here too. It only writes the equipment document. The equipment section in `packages/client` calls these routes.
7. Skills and battle statistics. Needs the skill catalog, the statistics document, and the equipment list. `get-skill-tree`, `learn-skill`, `reset-skills`, and `get-battle-statistics`. The formula applies equipped items and passive skills for real. The skills page and the statistics section in `packages/client` call these routes.
8. Enemy catalog. Static enemies. Each enemy points at item ids, skill ids, and a stat block that already exist. No routes.
9. Floor catalog. Static floors, tile sheets, and weighted enemies and treasures. No routes.
10. Expedition. Needs floors and the battle-stat formula. `createInitial` from sign-up, `get-floors`, `start-expedition`, and `get-expedition`. Start stores the computed battle statistics on the expedition document. The explore page in `packages/client` calls these routes. The C# name `Progress` is not used in TypeScript.
11. Battles. Needs enemies, battle stats, and active skills. `Start` and `Get` only. `BattleService.Act` stays unported. `get-battle` is the route. The battle page in `packages/client` calls it. Movement is what creates a battle, so this slice does not start one.
12. Expedition movement. Needs the expedition document, equipment, battle stats, skills, and battles. The three socket messages, cookie auth, and persist-and-drop on disconnect. Each random battle recomputes combat stats. Battle end still does not write resources back. The expedition page calls the socket and refetches expedition after reconnect.

Then:

13. Focused checks for auth (expiry, logout, rejected cookie), combat math against the C# results, and resource write-back as it works today, including the missing battle sync.
14. Combat model simplification, only after a gameplay rule is written down.
15. Remove the C# server, `apps/client`, Orval, and SignalR after the replacement flows work. `packages/client` is then the only client.
16. Absence values. Done. A missing domain value is `null` in documents, responses, and client state. The field is present (`T | null`). `undefined` is only a draft field or an optional parameter. `useApiRequest` `data`, `errors`, and `call` use `null`. An empty equipment slot stays `null`, including in `equipment-component.tsx`. `SessionId` is `string | null`. `LearnedSkills` is always stored, and an empty list is `[]`. A GET `call` takes no argument. The rule is in [TS_REWRITE_RULES.md](TS_REWRITE_RULES.md).

Shared contracts are added beside the route that uses them.

## Next step

Implement expedition movement. Needs the expedition document, equipment, battle stats, skills, and battles. The three socket messages, cookie auth, and persist-and-drop on disconnect. Each random battle recomputes combat stats and calls `BattleService.start`. Battle end still does not write resources back. The expedition page calls the socket and refetches expedition after reconnect. `BattleService.Act` stays unported.
