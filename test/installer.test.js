import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";

const INSTALLER = resolve("install/bunjang-assistant-install.mjs");

test("installer rejects unsupported remote source before planning install steps", async () => {
  const result = await runInstaller([
    "--tool",
    "codex",
    "--source",
    "https://example.com/evil.git",
    "--dry-run"
  ]);

  assert.notEqual(result.exitCode, 0);
  assert.match(result.stderr, /not in the allowed list/);
  assert.doesNotMatch(result.stdout, /npm install/);
  assert.doesNotMatch(result.stdout, /install-skills\.sh/);
});

test("installer dry-run does not create project skill directories", async () => {
  await withTempDir("bunjang-installer-dry-run-", async (dir) => {
    const result = await runInstaller(
      ["--tool", "codex", "--scope", "project", "--dry-run", "--json"],
      { cwd: dir }
    );

    assert.equal(result.exitCode, 0, result.stderr);
    assert.equal(await pathExists(join(dir, ".codex")), false);

    const parsed = JSON.parse(result.stdout);
    assert.ok(Array.isArray(parsed.warnings));
    assert.ok(parsed.steps.some((step) => step.includes("install-skills.sh")));
  });
});

function runInstaller(args, options = {}) {
  return new Promise((resolveResult) => {
    execFile(
      "node",
      [INSTALLER, ...args],
      {
        cwd: options.cwd || process.cwd(),
        env: { ...process.env, ...(options.env || {}) }
      },
      (error, stdout, stderr) => {
        resolveResult({
          exitCode: error?.code ?? 0,
          stdout,
          stderr
        });
      }
    );
  });
}

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function withTempDir(prefix, run) {
  const dir = await mkdtemp(join(tmpdir(), prefix));

  try {
    return await run(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
