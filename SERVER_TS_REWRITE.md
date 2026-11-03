# Errant Tower server: TypeScript migration

Move the C# ASP.NET server to TypeScript. Keep MongoDB, the current HTTP behavior, and the current gameplay. This is a low-traffic hobby project, so each step is the smallest change that makes one flow work.

Workspace setup is already on `main` (PR #129): pnpm, root oxlint / oxfmt / TypeScript, and `packages/shared`. The side-by-side test keeps two stacks:

- `apps/client` (`@errant/client`, Vite port 5173) calls the C# server at `https://localhost:7135`.
- `packages/client` (`@errant/client-ts`, Vite port 5174) calls the TypeScript server at `http://localhost:4000`.
- The TypeScript server package is `packages/server`. It does not listen yet.
- The C# server stays at `apps/errant-tower-server`.
- The map editor is `packages/map-editor` (`@errant/map-editor`, Vite port 5175). It is a workspace member and uses the shared tsconfig, oxlint, and oxfmt.

Do not merge `server/ts-rewrite-phase-0`. That branch commits IDE output, build output, and `appsettings.Development.json`.

Progress lives in [docs/ts-rewrite-progress.md](docs/ts-rewrite-progress.md).

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

At expedition start, copy health, mana, and energy maxes and currents from the computed battle stats onto the progress document.

On each random battle, recompute battle stats from the live character, current equipment, and active skills. Attack and the other combat fields are not stored on the expedition.

Equipment and skill changes during an expedition affect the next battle. That is what `ExpeditionService.CheckBattle` does today.

A later change may freeze a full combat snapshot. That needs an explicit gameplay rule, and it is a separate step after the loop is ported.

Battle completion does not write resources back to progress (`TODO(#93)`).

## Database access

One small module per domain that is being ported, with the operations that route needs (`findUserByEmail`, `updateProgress`, and so on). Name the fields in the filter. Extract a shared helper only after the same code appears twice.

## Sequence

1. Workspace. Done on `main`.
2. Auth slice. Fastify on port 4000, MongoDB, the cookie session, the four auth routes, boundary validation, and the sign-in and sign-up pages in `packages/client`. That client talks only to the TypeScript server. `apps/client` stays on the C# server.
3. One expedition and battle loop with the behavior above, including the three socket messages. The expedition and battle pages in `packages/client` call the TypeScript server for that loop.
4. Focused checks for auth (expiry, logout, rejected cookie), combat math against the C# results, and resource write-back as it works today, including the missing battle sync.
5. Combat model simplification, only after a gameplay rule is written down.
6. Remove the C# server, `apps/client`, Orval, and SignalR after the replacement flows work. `packages/client` is then the only client.

Shared contracts are added inside steps 2 and 3, beside the route that uses them.

## Next step

Implement one expedition and battle loop. Do not start combat-model simplification in that same change.
