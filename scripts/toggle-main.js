const fs = require("node:fs");
const path = require("node:path");

const packageJsonPath = path.resolve(__dirname, "../package.json");
const packageJson = require(packageJsonPath);

const arg = process.argv[2]; // コマンドライン引数を取得

if (arg === "build") {
  packageJson.main = "dist/commonjs/index.js";
  fs.writeFileSync(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
  );
  console.log("Successfully set main field in package.json for build.");
} else if (arg === "storybook") {
  packageJson.main = "node_modules/expo/AppEntry.js";
  fs.writeFileSync(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
  );
  console.log("Successfully set main field in package.json for Storybook.");
} else {
  console.error('Invalid argument. Please use "build" or "storybook".');
  process.exit(1);
}
