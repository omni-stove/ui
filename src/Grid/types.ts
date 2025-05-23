import type { ReactNode } from "react";
import type { LayoutChangeEvent, ViewStyle } from "react-native";

export type GridProps = {
  columns?: number | "auto";
  spacing?: number | "compact" | "comfortable" | "spacious";
  margin?: number;
  children: ReactNode;
  style?: ViewStyle;
  variant?: "masonry" | "standard";
};

export type GridItemProps = {
  children: ReactNode;
  span?: number;
  style?: ViewStyle;
  onLayout?: (event: LayoutChangeEvent) => void;
};

export type MasonryItem = {
  id: string;
  height: number;
  component: ReactNode;
};

export type MasonryPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MasonryLayout = {
  positions: MasonryPosition[];
  totalHeight: number;
};

export type SpacingToken = "compact" | "comfortable" | "spacious";
