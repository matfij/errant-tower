# TypeScript rewrite rules

Rules from review of the auth slice and the skill catalog, including handwritten follow-up edits. Use them on later slices. Update this file when new feedback lands.

The migration plan stays in [SERVER_TS_REWRITE.md](SERVER_TS_REWRITE.md). The checklist stays in [docs/ts-rewrite-progress.md](docs/ts-rewrite-progress.md).

## Catalog shape

A static catalog is a dictionary plus helpers. It is not a service class. Items, enemies, and floors follow the skill catalog.

- The id enum is a string enum. The member name and the stored value stay the same: `Scratch = "Scratch"`. Do not use a const object plus `(typeof X)[keyof typeof X]`. Do not use `` `${SkillGuid}` `` so that a bare string is accepted. Call sites use `SkillGuid.Scratch`.
- Keep the enum even though the registry repeats each member as a key. Learned skills will be stored, and the string has to stay stable. `keyof typeof skills` is not a replacement. `satisfies Record<SkillGuid, Skill>` is the check that every id is registered.
- The id enum lives in the definition file, above the types. The registry imports the data files, so the data files cannot import the registry. That import cycle leaves the enum undefined at runtime.
- Do not re-export the id enum from the registry. Callers import it from the definition file. The registry imports it only to build the dictionary keys.
- The definition file does not import the registry.
- Data objects are plain consts. Do not annotate them with an inline object type. The type comes from the define helper.
- Each data entry uses the enum: `guid: SkillGuid.Scratch`.
- Write level lists as literal arrays. Do not generate them with `Array.from`, `.map`, or helpers such as `defenseDown` and `percentSteps`.
- No startup validator. A missing id fails `tsc` through `satisfies`. Do not add an oxlint plugin or tests for array length unless asked. The server has no test suite.
- The catalog stays in `packages/server`. Shared response types are added beside the route that returns them. Client wiring is that route's slice, not the catalog slice.

## File order

Read top-down: the most important declaration first, then the smaller pieces.

Definition file: id enum, then the top-level type, then the types it contains, then the enums those types use, from the broadest enum to the smallest.

Registry file: the dictionary, then the public lookup, then the private type guard.

Utils file, as edited in `skill-utils.ts`:

1. File-level constants, such as `skillLevel`.
2. Types, from the whole draft down to the smallest draft.
3. Functions in that same order. The public function first. Helpers of the same rank stay together. The smallest helpers last.

Do not add a helper whose only job is one object inside a `.map` callback. `fillEffect` and `fillProperty` were removed for that reason. The object is written in the callback of `fillEffects` and `fillProperties`.

A const arrow is not hoisted. A helper that runs while its module is still initializing has to be declared above that call. Helpers that run only after the module has finished loading can sit below the function that calls them. The same order applies outside catalogs. In `api-utils.ts`, `useApiRequest` is above `postJson`, then `apiFetch` and `readErrors`.

## Values

Handwritten optional fields use `field?: T`. A missing description is omitted. Do not type that as `T | null`.

`null` stays for stored user fields and for not-found results.

Catalog enums are strings. Do not keep the C# integer values. HTTP enums for a ported route are also strings, added in `packages/shared` with that route.

## Classes

- A class that owns collaborators is constructed where the app is wired. Do not thread the same dependency through every call.
- Constructor parameters use the full name: `userRepository`, not `users`. Rename a store to a repository.
- Declare fields above the constructor and assign them there. Do not use parameter properties.
- Private fields come first, then the constructor, then public methods, then private methods.
- A static helper is named `*Service`, and the file name matches the class. Do not add an empty private constructor. Call it on the class name.
- Ids come from `UtilsService.newId`. Time comes from `UtilsService.timeNow`. Logging goes through `LogService` after `LogService.bind`. Do not inject a logger, a clock, or an id generator into each service.
- `EmailService` is constructed with `new` and owns the mail client. Templates are plain objects. Do not HTML-escape a value that was already validated.
- `config` is a plain object. The start script loads `.env`. Do not add a config class or a custom env parser.
- Do not turn a route group into a Fastify plugin unless asked. The route class stays a thin controller. The orchestrator calls the services.

## Persistence

- Folders follow the C# tree: `domains/<plural>/`, `orchestrator/`, `common/`, `db/`. One file per type: `user-repository.ts`, `user-service.ts`.
- The connector owns the client, the collections, and the indexes. A repository receives only its own collection and writes only its own entity.
- The orchestrator creates related rows after the owning service succeeds. Do not put another entity's insert on the user repository.
- A unique-index failure is handled in the service. Put a well-known Mongo code on `dbErrorCodes` in `db-utils`. Do not catch it in the repository, and do not add a helper whose only job is building that `HttpError`.
- Document types name the BSON fields. Shared readers such as `readNumber` and `toInt32` live in `db-utils`. Do not add `absent()` casts. Create indexes with the three-argument form.
- Prefer arrow functions for callbacks and free functions. Class methods stay methods. Overload signatures stay function declarations.

## HTTP

- `HttpError` extends `Error` and is constructed with `new`. Fields, then the constructors, then `body()`. `new HttpError(key)` is 400. `new HttpError(key, statusCode)` sets the status. `new HttpError(statusCode, errors)` is the list form. The error handler sends `error.body()`.
- `RequestBodyService.parse` infers the body type from the schema argument. Do not pass an explicit type argument or annotate the variable.
- A route handler builds the response object at the return. Do not add a mapper on the route class.
- Unknown routes use `setNotFoundHandler` and return 404 `{ errors: [{ key: "errors.notFound" }] }`. They do not fall through to the 500 handler.
- Business and validation errors stay 400. 401 is only a missing or dead session.

## Auth errors

- Sign-in does not say whether the email exists. An unknown or unconfirmed email still returns success and sends no mail.
- Sign-up names the conflict. `errors.signUpEmailTaken` means that email is already registered. `errors.signUpUsernameTaken` means that username is taken. `errors.signUpStarted` means that email already has an unconfirmed sign-up. Do not collapse those into one "try different details" message.
- A rejected code is one message per flow: `errors.signInCodeRejected` or `errors.signUpCodeRejected`. A failed send is `errors.signInEmailFailed` or `errors.signUpEmailFailed`.
- Copy for those keys lives in `packages/client`. Do not edit `apps/client` locales.

## Client

- New hand-written calls live in `packages/client/src/api`. Orval, `api-proxy`, and `custom-fetch` stay in `api-old` until that page is ported. Do not add new routes under `api-old`. Point Orval at `api-old`.
- A page calls `useApiRequest(requestFn)`. Do not hide the request inside a named hook such as `useStartSignIn`.
- `api-utils` holds the shared helpers. A domain file such as `auth-api` holds that domain's requests. `fetchSession` and `signOutRequest` stay plain functions because they are not form state. `signOutRequest` treats 401 as success. `fetchSession` returns null on 401.
- Prefer those helpers over React Query as each page leaves `api-old`. After a change, call the read again. Do not add cache invalidation. Leave `@tanstack/react-query` installed until those pages are gone.
- The session check calls `fetchSession` directly, after the user store hydrates and again when the window gains focus. Sign the user in only when it returns a user. Any other result, including a network or 500 error, clears the persisted user before the gate opens. Sign-in, sign-up, and sign-out write the user store, and that write drops an older in-flight session response.

## Port constraints that later slices already follow

- Edits stay under `packages/`. Do not edit `apps/client`.
- A slice lands only when every call it makes already exists. Do not stub a later domain.
- Sign-up does not create progress, statistics, or equipment until that domain's slice wires `createInitial`.
- Do not add tests unless asked.
- Pause when a design choice is unclear.
