// Builds the static GitHub Pages preview into ./out
// Server-only parts (src/app/api: checkout, admin, forms) can't run on GitHub Pages,
// so they are set aside during this build and always restored afterwards.
import { execSync } from "node:child_process";
import { existsSync, renameSync, rmSync, writeFileSync } from "node:fs";

const api = "src/app/api";
const parked = "src/app/_api-disabled-for-pages";

if (existsSync(parked)) renameSync(parked, api); // recover from an interrupted run
renameSync(api, parked);
rmSync(".next", { recursive: true, force: true }); // drop cached route types that still list the API
try {
  execSync("npx next build", { stdio: "inherit", env: { ...process.env, GITHUB_PAGES: "true" } });
  writeFileSync("out/.nojekyll", "");
} finally {
  renameSync(parked, api);
}
