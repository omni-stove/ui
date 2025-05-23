const fs = require("node:fs");
const path = require("node:path");

const packageJsonPath = path.resolve(__dirname, "../package.json");
const packageJson = require(packageJsonPath);

packageJson.main = "dist/commonjs/index.js"; // ビルド用のmainパス

fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
console.log("Successfully set main field in package.json for build.");
