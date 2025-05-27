import { useTheme as usePaperTheme } from "react-native-paper";
import { calculateMaterial3Colors } from "./theme";
import type { Material3Colors } from "./types";
import type { ExtendedTheme } from "./types";

/**
 * Custom hook to access the extended Material 3 theme.
 * This hook takes the base theme from `react-native-paper` and extends its `colors`
 * object with a full set of Material 3 dynamic colors, calculated based on the
 * primary color of the base theme.
 *
 * @returns {ExtendedTheme} The extended theme object containing Material 3 colors.
 * @see {@link ExtendedTheme}
 * @see {@link calculateMaterial3Colors}
 * @see {@link usePaperTheme}
 */
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

// Theme related hooks and functions are now in ./theme
export * from "./theme";

// Type exports remain here for now, or could also be moved if preferred
export type { Material3Colors, ExtendedTheme } from "./types";
