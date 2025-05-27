import type { ReactNode } from "react";
import type { LayoutChangeEvent, ViewStyle } from "react-native";

/**
 * Props for the `Grid` component.
 * @param {number | "compact" | "comfortable" | "spacious"} [spacing="comfortable"] -
 *        The spacing between grid items. Can be a number or a predefined token.
 * @param {number} [margin=16] - The margin around the entire grid container.
 * @param {ReactNode} children - The content of the grid, typically `GridItem` components.
 * @param {ViewStyle} [style] - Custom style for the grid container.
 * @param {"masonry" | "standard"} [variant="standard"] - The layout variant of the grid.
 *        "standard" for a simple row-wrapping grid, "masonry" for a Pinterest-like layout.
 *        Columns are automatically determined based on Material Design 3 breakpoints.
 */
export type GridProps = {
  spacing?: number | "compact" | "comfortable" | "spacious";
  margin?: number;
  children: ReactNode;
  style?: ViewStyle;
  variant?: "masonry" | "standard";
};

/**
 * Props for the `GridItem` component.
 * @param {ReactNode} children - The content of the grid item.
 * @param {number} [span=1] - The number of columns this item should span in a "standard" grid.
 * @param {ViewStyle} [style] - Custom style for the grid item container.
 * @param {(event: LayoutChangeEvent) => void} [onLayout] - Callback for layout changes,
 *        used internally by the "masonry" grid to determine item height.
 */
export type GridItemProps = {
  children: ReactNode;
  span?: number;
  style?: ViewStyle;
  onLayout?: (event: LayoutChangeEvent) => void;
};

/**
 * Represents an item within a masonry layout.
 * @param {string} id - A unique identifier for the masonry item.
 * @param {number} height - The height of the masonry item.
 * @param {ReactNode} component - The ReactNode representing the content of the item.
 */
export type MasonryItem = {
  id: string;
  height: number;
  component: ReactNode;
};

/**
 * Represents the calculated position and dimensions of an item in a masonry layout.
 * @param {number} x - The x-coordinate (left position) of the item.
 * @param {number} y - The y-coordinate (top position) of the item.
 * @param {number} width - The width of the item.
 * @param {number} height - The height of the item.
 */
export type MasonryPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Represents the result of a masonry layout calculation.
 * @param {MasonryPosition[]} positions - An array of calculated positions for each item.
 * @param {number} totalHeight - The total height of the masonry layout.
 */
export type MasonryLayout = {
  positions: MasonryPosition[];
  totalHeight: number;
};

/**
 * Defines predefined spacing tokens for the grid.
 * - `compact`: Smaller spacing.
 * - `comfortable`: Default, moderate spacing.
 * - `spacious`: Larger spacing.
 */
export type SpacingToken = "compact" | "comfortable" | "spacious";
