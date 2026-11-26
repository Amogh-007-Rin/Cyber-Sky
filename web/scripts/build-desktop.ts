import { spawn } from "node:child_process";
import { existsSync, renameSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const authRoute = resolve(webRoot, "app/api/auth/[...nextauth]/route.ts");
const excludedAuthRoute = `${authRoute}.desktop-excluded`;
let routeExcluded = false;

if (existsSync(authRoute)) {
  renameSync(authRoute, excludedAuthRoute);
  routeExcluded = true;
}

try {
  process.exitCode = await new Promise<number>((resolveExitCode, reject) => {
    const build = spawn("bun", ["--bun", "next", "build"], {
      cwd: webRoot,
      env: {
        ...process.env,
        TAURI_DESKTOP_BUILD: "true",
      },
      stdio: "inherit",
    });

    build.on("error", reject);
    build.on("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`Next.js build terminated by ${signal}`));
        return;
      }

      resolveExitCode(code ?? 1);
    });
  });
} finally {
  if (routeExcluded) {
    renameSync(excludedAuthRoute, authRoute);
  }
}
