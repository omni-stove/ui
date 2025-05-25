import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import type { MasonryItem } from "./types";
import {
  calculateMasonryLayout,
  getMaxColumns,
  getResponsiveColumns,
} from "./utils";

/**
 * Custom hook to get the number of columns for a responsive grid layout.
 * If `defaultColumns` is a number, it returns that number.
 * If `defaultColumns` is "auto" or undefined, it calculates the number of columns
 * based on the window width using `getResponsiveColumns`.
 *
 * @param {number | "auto"} [defaultColumns] - The desired number of columns or "auto" for responsive calculation.
 * @returns {number} The calculated number of columns.
 * @see {@link getResponsiveColumns}
 */
export const useResponsiveColumns = (defaultColumns?: number | "auto") => {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    if (typeof defaultColumns === "number") return defaultColumns;
    return getResponsiveColumns(width);
  }, [width, defaultColumns]);
};

/**
 * Custom hook to get the maximum number of columns for a responsive grid layout
 * based on the current window width.
 *
 * @returns {number} The maximum number of columns.
 * @see {@link getMaxColumns}
 */
export const useMaxColumns = () => {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    return getMaxColumns(width);
  }, [width]);
};

/**
 * Custom hook to calculate the positions and total height for a masonry grid layout.
 * It memoizes the result based on items, number of columns, spacing, and container width.
 *
 * @param {MasonryItem[]} items - An array of items to be laid out, each with an id and height.
 * @param {number} columns - The number of columns in the masonry layout.
 * @param {number} spacing - The spacing between items in the layout.
 * @param {number} containerWidth - The width of the container for the masonry layout.
 * @returns {{ positions: Array<{ top: number; left: number; width: number; height: number }>, totalHeight: number }}
 *          An object containing an array of item positions and the total height of the layout.
 *          Returns an empty positions array and totalHeight 0 if containerWidth is 0 or items array is empty.
 * @see {@link calculateMasonryLayout}
 * @see {@link MasonryItem}
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
