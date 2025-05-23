import type { MasonryItem, MasonryLayout, SpacingToken } from "./types";

/**
 * Material Design 3のスペーシングトークンを数値に変換
 */
export const getSpacingValue = (spacing: number | SpacingToken): number => {
  if (typeof spacing === "number") return spacing;

  switch (spacing) {
    case "compact":
      return 8;
    case "comfortable":
      return 16;
    case "spacious":
      return 24;
    default:
      return 16;
  }
};

/**
 * Masonryレイアウトの位置を計算
 */
export const calculateMasonryLayout = (
  items: MasonryItem[],
  columns: number,
  spacing: number,
  containerWidth: number,
): MasonryLayout => {
  if (columns <= 0 || containerWidth <= 0) {
    return { positions: [], totalHeight: 0 };
  }

  const columnWidth = (containerWidth - spacing * (columns - 1)) / columns;
  const columnHeights = new Array(columns).fill(0);
  const positions = [];

  for (const item of items) {
    // 最も低いカラムのインデックスを見つける
    const shortestColumnIndex = columnHeights.indexOf(
      Math.min(...columnHeights),
    );

    const x = shortestColumnIndex * (columnWidth + spacing);
    const y = columnHeights[shortestColumnIndex];

    positions.push({
      x,
      y,
      width: columnWidth,
      height: item.height,
    });

    // カラムの高さを更新（アイテムの高さ + スペーシング）
    columnHeights[shortestColumnIndex] += item.height + spacing;
  }

  // 最後のアイテムの下にはスペーシングが不要なので調整
  const totalHeight = Math.max(...columnHeights) - spacing;

  return {
    positions,
    totalHeight: Math.max(0, totalHeight),
  };
};

/**
 * Material Design 3のブレークポイントに基づいてカラム数を決定
 * 12カラムシステムを基準とした適切なカラム数を返す
 */
export const getResponsiveColumns = (width: number): number => {
  // Material Design 3 breakpoints
  if (width < 600) return 4; // Mobile: 4カラム
  if (width < 840) return 8; // Tablet: 8カラム
  return 12; // Desktop & Large Desktop: 12カラム
};

/**
 * Material Design 3のブレークポイントに基づいて最大カラム数を決定
 * GridItemで使用する基準カラム数
 */
export const getMaxColumns = (width: number): number => {
  // Material Design 3 breakpoints
  if (width < 600) return 4; // Mobile: 4カラム
  if (width < 840) return 8; // Tablet: 8カラム
  return 12; // Desktop & Large Desktop: 12カラム
};
