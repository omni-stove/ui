#!/usr/bin/env node

import { spawn } from "node:child_process";
import { cpSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);

if (args.includes("--mcp")) {
  // MCPサーバーを起動
  const mcpServerScript = resolve(__dirname, "../mcp-server/index.ts");

  console.log("Starting Omni Stove UI MCP Server...");

  const mcpProcess = spawn("npx", ["tsx", mcpServerScript], {
    cwd: resolve(__dirname, ".."),
    stdio: "inherit",
    shell: true,
  });

  mcpProcess.on("error", (err) => {
    console.error("Failed to start MCP server:", err);
    process.exit(1);
  });

  mcpProcess.on("exit", (code) => {
    process.exit(code);
  });
} else if (args.includes("--extract")) {
  // srcディレクトリをターゲットにコピー
  const extractIndex = args.indexOf("--extract");
  const targetDir = args[extractIndex + 1];

  if (!targetDir) {
    console.error("Error: Target directory is required for --extract option");
    console.log("Usage: npx @omni-stove/ui --extract <target-directory>");
    process.exit(1);
  }

  const srcPath = resolve(__dirname, "../src");
  const targetPath = resolve(process.cwd(), targetDir);

  try {
    mkdirSync(targetPath, { recursive: true });
    cpSync(srcPath, targetPath, { recursive: true });
    console.log(`✓ Components extracted to: ${targetPath}`);
  } catch (err) {
    console.error("Failed to extract components:", err.message);
    process.exit(1);
  }
} else {
  console.log("Omni Stove UI Component Library");
  console.log("\nUsage:");
  console.log(
    "  npx @omni-stove/ui --mcp                 Start the MCP server",
  );
  console.log(
    "  npx @omni-stove/ui --extract <dir>        Extract components to directory",
  );
  console.log(
    "\nFor component documentation, visit: https://github.com/omni-stove/ui",
  );
}
