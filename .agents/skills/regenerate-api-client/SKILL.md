---
name: regenerate-api-client
description: Regenerate the frontend API client from the backend's Swagger/OpenAPI spec. Use whenever the user asks to "regenerate the api client", update generated API types/hooks, sync the client with backend changes, or mentions swagger.json being out of date.
---

# Regenerate API Client

Regenerates `apps/errant-tower-client`'s API client from the live Swagger spec served by `apps/errant-tower-server`.

## Steps

1. **Start the server**
   Run the server app: `apps/errant-tower-server/ErrantTowerServer.csproj`.
   Wait for it to finish starting before continuing.

2. **Confirm the port**
   The server's HTTPS port can vary between runs/machines. Check `apps/errant-tower-client/.env.local` for `VITE_API_URL` to confirm the port currently in use.

3. **Fetch the spec**
   Visit `https://localhost:<port>/swagger/v1/swagger.json` (using the port from step 2) and save its contents to `apps/errant-tower-client/src/api/swagger.json`, overwriting the existing file.

4. **Generate the client**
   From `apps/errant-tower-client`, run: `npm run api:gen`

5. **Verify**
   Confirm the command exits without errors and that generated files under `src/api` have changed (e.g. via `git status` or `git diff --stat`). If nothing changed, the spec may not have actually updated — double check step 3.

## Notes

- Stop the server afterward if it was only started for this task.
- If `npm run api:gen` fails, check that `swagger.json` is valid JSON (a failed fetch in step 3 sometimes saves an HTML error page instead).
