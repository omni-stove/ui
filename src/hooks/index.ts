import {
  argbFromHex,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import { useTheme as usePaperTheme } from "react-native-paper";
import type { ExtendedTheme, Material3Colors } from "./types";

// ARGB to HEX 変換関数
const argbToHex = (argb: number): string => {
  const red = (argb >> 16) & 0xff;
  const green = (argb >> 8) & 0xff;
  const blue = argb & 0xff;
  return `#${[red, green, blue]
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")}`;
};

// キーカラーからMaterial3の全カラーを動的に計算
const calculateMaterial3Colors = (
  sourceColor: string,
  isDark: boolean,
): Partial<Material3Colors> => {
  // キーカラーからMaterial3テーマを生成
  const sourceColorArgb = argbFromHex(sourceColor);
  const theme = themeFromSourceColor(sourceColorArgb);

  const scheme = isDark ? theme.schemes.dark : theme.schemes.light;
  const palettes = theme.palettes;

  // 基本的な色はschemeから取得
  const baseColors = {
    primary: argbToHex(scheme.primary),
    onPrimary: argbToHex(scheme.onPrimary),
    primaryContainer: argbToHex(scheme.primaryContainer),
    onPrimaryContainer: argbToHex(scheme.onPrimaryContainer),
    secondary: argbToHex(scheme.secondary),
    onSecondary: argbToHex(scheme.onSecondary),
    secondaryContainer: argbToHex(scheme.secondaryContainer),
    onSecondaryContainer: argbToHex(scheme.onSecondaryContainer),
    tertiary: argbToHex(scheme.tertiary),
    onTertiary: argbToHex(scheme.onTertiary),
    tertiaryContainer: argbToHex(scheme.tertiaryContainer),
    onTertiaryContainer: argbToHex(scheme.onTertiaryContainer),
    error: argbToHex(scheme.error),
    onError: argbToHex(scheme.onError),
    errorContainer: argbToHex(scheme.errorContainer),
    onErrorContainer: argbToHex(scheme.onErrorContainer),
    background: argbToHex(scheme.background),
    onBackground: argbToHex(scheme.onBackground),
    surface: argbToHex(scheme.surface),
    onSurface: argbToHex(scheme.onSurface),
    surfaceVariant: argbToHex(scheme.surfaceVariant),
    onSurfaceVariant: argbToHex(scheme.onSurfaceVariant),
    outline: argbToHex(scheme.outline),
    outlineVariant: argbToHex(scheme.outlineVariant),
    shadow: argbToHex(scheme.shadow),
    scrim: argbToHex(scheme.scrim),
    inverseSurface: argbToHex(scheme.inverseSurface),
    inverseOnSurface: argbToHex(scheme.inverseOnSurface),
    inversePrimary: argbToHex(scheme.inversePrimary),
  };

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

  return {
    ...baseColors,
    ...additionalColors,
  };
};

export const useTheme = (): ExtendedTheme => {
  const paperTheme = usePaperTheme();
  const isDark = paperTheme.dark;

  // キーカラーを取得（primaryカラーを使用）
  const sourceColor = paperTheme.colors.primary;

  // Material3の仕様に基づいて全カラーを動的に計算
  const material3Colors = calculateMaterial3Colors(sourceColor, isDark);

  // Extend Paper theme with Material3 colors
  const extendedTheme: ExtendedTheme = {
    ...paperTheme,
    colors: {
      // Base Paper colors
      ...paperTheme.colors,
      // Material3 specific colors (動的に計算)
      ...material3Colors,
    } as Material3Colors,
  };

  return extendedTheme;
};

export type { Material3Colors, ExtendedTheme } from "./types";
