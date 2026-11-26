# Cyber Sky Desktop Client

This is the Tauri v2 desktop shell for the existing Next.js frontend in `../web`.

## Development

From this directory:

```bash
bun install
bun run dev
```

`tauri dev` starts the Next.js development server in `../web` and loads it at
`http://localhost:3000`.

## Production build

```bash
bun run build
```

The web app is statically exported to `../web/out` and bundled into the Tauri
application. Tauri does not run a Next.js server inside the packaged desktop
application, so server-only Next.js features must be provided by the backend.
The existing web-only NextAuth route is excluded from the desktop export and
is restored immediately after the build.
