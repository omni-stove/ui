import react from "@vitejs/plugin-react";
import babel from "vite-plugin-babel";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), babel()],
  test: {
    // ここにテストの設定を書いていく感じ！
    // 例えば、グローバルAPIを使えるようにしたりとかね
    globals: true,
    // Reactのテストは今回スコープ外だから、environmentはnodeでいいかな
    environment: "node",
    // in-source testing の設定を追加
    includeSource: ["src/**/*.{js,ts,jsx,tsx}"],
  },
});
