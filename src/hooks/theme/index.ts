import {
  argbFromHex,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import type { Material3Colors } from "../types"; // パスを修正

// RGBA to HEXA 変換関数
/**
 * Converts an RGBA or RGB string to a HEXA string (e.g., #RRGGBBAA).
 * If the input is not a valid RGBA/RGB string, it returns the original string.
 * @param {string} rgba - The RGBA or RGB color string (e.g., "rgba(255,0,0,0.5)", "rgb(255,0,0)").
 * @returns {string} The HEXA color string or the original string if conversion fails.
 */
const convertRgbaToHex = (rgba: string): string => {
  const result = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/.exec(
    rgba,
  );
  if (!result) {
    // もしHEX形式が直接来た場合や、不正な形式の場合はそのまま返す
    if (/^#([0-9A-Fa-f]{3,4}){1,2}$/.test(rgba)) {
      return rgba;
    }
    console.warn(`Invalid RGBA/RGB string for conversion: ${rgba}`);
    return rgba; // Or throw an error, or return a default color
  }
  const r = Number.parseInt(result[1], 10);
  const g = Number.parseInt(result[2], 10);
  const b = Number.parseInt(result[3], 10);
  const a = result[4] ? Math.round(Number.parseFloat(result[4]) * 255) : 255; // Alphaは0-1なので255倍

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}${a
    .toString(16)
    .padStart(2, "0")}`;
};

// ARGB to HEXA 変換関数（アルファ値含む）
/**
 * Converts an ARGB (Alpha, Red, Green, Blue) number to a HEXA string (e.g., #RRGGBBAA).
 * @param {number} argb - The ARGB color value as a number.
 * @returns {string} The HEXA color string.
 */
const argbToHex = (argb: number): string => {
  const alpha = (argb >> 24) & 0xff;
  const red = (argb >> 16) & 0xff;
  const green = (argb >> 8) & 0xff;
  const blue = argb & 0xff;
  return `#${[red, green, blue, alpha]
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")}`;
};

// キーカラーからMaterial3の全カラーを動的に計算
/**
 * Calculates a partial set of Material 3 dynamic colors based on a source color and theme mode (dark/light).
 * It uses `@material/material-color-utilities` to generate color palettes and then derives
 * specific M3 color roles (like primaryFixed, surfaceContainer, etc.) from these palettes.
 *
 * @param {string} sourceColor - The source color in hex format (e.g., "#6750A4").
 * @param {boolean} isDark - True if the dark theme is active, false for light theme.
 * @returns {Partial<Material3Colors>} An object containing the calculated Material 3 color roles.
 * @see {@link https://github.com/material-foundation/material-color-utilities|Material Color Utilities}
 * @see {@link Material3Colors}
 */
const calculateMaterial3Colors = (
  sourceColor: string,
  isDark: boolean,
): Partial<Material3Colors> => {
  // RGBA形式が来た場合、HEX形式に変換する
  const hexColor = sourceColor.startsWith("rgba")
    ? convertRgbaToHex(sourceColor)
    : sourceColor;

  // キーカラーからMaterial3テーマを生成
  const sourceColorArgb = argbFromHex(hexColor);
  const theme = themeFromSourceColor(sourceColorArgb);
  const palettes = theme.palettes;
  // 追加の詳細なカラーロールをパレットとトーンから生成（オタクくんのCSS生成スクリプト参考）
  const additionalColors = isDark
    ? {
        // ダークテーマ用のトーン（M3仕様）
        primaryFixed: argbToHex(palettes.primary.tone(90)),
        primaryFixedDim: argbToHex(palettes.primary.tone(80)),
        onPrimaryFixed: argbToHex(palettes.primary.tone(10)),
        onPrimaryFixedVariant: argbToHex(palettes.primary.tone(30)),
        secondaryFixed: argbToHex(palettes.secondary.tone(90)),
        secondaryFixedDim: argbToHex(palettes.secondary.tone(80)),
        onSecondaryFixed: argbToHex(palettes.secondary.tone(10)),
        onSecondaryFixedVariant: argbToHex(palettes.secondary.tone(30)),
        tertiaryFixed: argbToHex(palettes.tertiary.tone(90)),
        tertiaryFixedDim: argbToHex(palettes.tertiary.tone(80)),
        onTertiaryFixed: argbToHex(palettes.tertiary.tone(10)),
        onTertiaryFixedVariant: argbToHex(palettes.tertiary.tone(30)),
        surfaceDim: argbToHex(palettes.neutral.tone(6)),
        surfaceBright: argbToHex(palettes.neutral.tone(24)),
        surfaceContainerLowest: argbToHex(palettes.neutral.tone(4)),
        surfaceContainerLow: argbToHex(palettes.neutral.tone(10)),
        surfaceContainer: argbToHex(palettes.neutral.tone(12)),
        surfaceContainerHigh: argbToHex(palettes.neutral.tone(17)),
        surfaceContainerHighest: argbToHex(palettes.neutral.tone(22)),
        surfaceTint: argbToHex(palettes.primary.tone(80)),
      }
    : {
        // ライトテーマ用のトーン（M3仕様）
        primaryFixed: argbToHex(palettes.primary.tone(90)),
        primaryFixedDim: argbToHex(palettes.primary.tone(80)),
        onPrimaryFixed: argbToHex(palettes.primary.tone(10)),
        onPrimaryFixedVariant: argbToHex(palettes.primary.tone(30)),
        secondaryFixed: argbToHex(palettes.secondary.tone(90)),
        secondaryFixedDim: argbToHex(palettes.secondary.tone(80)),
        onSecondaryFixed: argbToHex(palettes.secondary.tone(10)),
        onSecondaryFixedVariant: argbToHex(palettes.secondary.tone(30)),
        tertiaryFixed: argbToHex(palettes.tertiary.tone(90)),
        tertiaryFixedDim: argbToHex(palettes.tertiary.tone(80)),
        onTertiaryFixed: argbToHex(palettes.tertiary.tone(10)),
        onTertiaryFixedVariant: argbToHex(palettes.tertiary.tone(30)),
        surfaceDim: argbToHex(palettes.neutral.tone(87)),
        surfaceBright: argbToHex(palettes.neutral.tone(98)),
        surfaceContainerLowest: argbToHex(palettes.neutral.tone(100)),
        surfaceContainerLow: argbToHex(palettes.neutral.tone(96)),
        surfaceContainer: argbToHex(palettes.neutral.tone(94)),
        surfaceContainerHigh: argbToHex(palettes.neutral.tone(92)),
        surfaceContainerHighest: argbToHex(palettes.neutral.tone(90)),
        surfaceTint: argbToHex(palettes.primary.tone(40)),
      };

  return additionalColors;
};

// export type { Material3Colors, ExtendedTheme } from "../types"; // 型はtypes.tsから直接使うのでここでは不要
// ↑の行はコメントアウトしたけど、実際には削除するね！
// 型は src/hooks/types.ts から直接インポート・エクスポートされる想定。
// このファイルでは、具体的な実装（関数とフック）をエクスポートする。
// もし、このモジュール独自の型が必要になったら、ここで定義してエクスポートする感じ。

// テストのためにprivateな関数もエクスポートしておく（必要に応じて）
export { argbToHex, calculateMaterial3Colors };
