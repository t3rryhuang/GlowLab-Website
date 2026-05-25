import { execSync } from "node:child_process";

const port = process.argv[2] || "3000";

try {
  const out = execSync(`lsof -ti :${port}`, { encoding: "utf8" }).trim();
  if (!out) {
    process.exit(0);
  }
  const pids = out.split(/\s+/).filter(Boolean);
  for (const pid of pids) {
    try {
      execSync(`kill -9 ${pid}`);
      console.log(`Stopped process ${pid} on port ${port}`);
    } catch {
      /* already gone */
    }
  }
} catch {
  /* nothing listening */
}
