import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import type { MasonryItem } from "./types";
import { calculateMasonryLayout, getResponsiveColumns } from "./utils";

/**
 * レスポンシブなカラム数を取得するフック
 */
export const useResponsiveColumns = (defaultColumns?: number | "auto") => {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    if (typeof defaultColumns === "number") return defaultColumns;
    return getResponsiveColumns(width);
  }, [width, defaultColumns]);
};

/**
 * Masonryレイアウトの位置を計算するフック
 */
export const useMasonryLayout = (
  items: MasonryItem[],
  columns: number,
  spacing: number,
  containerWidth: number,
) => {
  return useMemo(() => {
    if (!containerWidth || items.length === 0) {
      return { positions: [], totalHeight: 0 };
    }

    return calculateMasonryLayout(items, columns, spacing, containerWidth);
  }, [items, columns, spacing, containerWidth]);
};
