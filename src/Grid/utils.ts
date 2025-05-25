import type { MasonryItem, MasonryLayout, SpacingToken } from "./types";

/**
 * Converts Material Design 3 spacing tokens ("compact", "comfortable", "spacious")
 * or a numeric value into a numerical spacing value.
 *
 * @param {number | SpacingToken} spacing - The spacing token or a numeric value.
 * @returns {number} The numerical spacing value. Defaults to 16 for "comfortable" or unknown tokens.
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
      return 16; // Default to comfortable
  }
};

/**
 * Calculates the positions and total height for items in a masonry layout.
 * It distributes items across a specified number of columns, attempting to keep
 * column heights balanced.
 *
 * @param {MasonryItem[]} items - An array of items to be laid out, each with an id and height.
 * @param {number} columns - The number of columns in the masonry layout.
 * @param {number} spacing - The spacing (gap) between items, both horizontally and vertically.
 * @param {number} containerWidth - The total width available for the masonry layout.
 * @returns {MasonryLayout} An object containing an array of calculated item positions (`positions`)
 *                          and the total height (`totalHeight`) of the layout.
 *                          Returns an empty layout if columns or containerWidth is non-positive.
 * @see {@link MasonryItem}
 * @see {@link MasonryLayout}
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
    totalHeight: Math.max(0, totalHeight), // Ensure totalHeight is not negative
  };
};

/**
 * Determines the appropriate number of columns for a grid based on Material Design 3 breakpoints
 * and the provided screen width. It typically returns 4, 8, or 12 columns.
 *
 * @param {number} width - The current screen or container width.
 * @returns {number} The number of columns to use (4 for mobile, 8 for tablet, 12 for desktop).
 * @see {@link https://m3.material.io/foundations/layout/applying-layout/window-size-classes|M3 Window size classes}
 */
export const getResponsiveColumns = (width: number): number => {
  // Material Design 3 breakpoints
  if (width < 600) return 4; // Mobile: 4カラム
  if (width < 840) return 8; // Tablet: 8カラム
  return 12; // Desktop & Large Desktop: 12カラム
};

/**
 * Determines the maximum number of columns for a grid based on Material Design 3 breakpoints.
 * This is used as a reference by `GridItem` to calculate its span.
 *
 * @param {number} width - The current screen or container width.
 * @returns {number} The maximum number of columns (4 for mobile, 8 for tablet, 12 for desktop).
 * @see {@link https://m3.material.io/foundations/layout/applying-layout/window-size-classes|M3 Window size classes}
 */
export const getMaxColumns = (width: number): number => {
  // Material Design 3 breakpoints
  if (width < 600) return 4; // Mobile: 4カラム
  if (width < 840) return 8; // Tablet: 8カラム
  return 12; // Desktop & Large Desktop: 12カラム
};
