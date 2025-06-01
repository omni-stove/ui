import type { ReactNode } from "react";
import { View, type ViewStyle } from "react-native";

type StackProps = {
  /**
   * The direction of the stack.
   * @default 'column'
   */
  direction?: "row" | "column";
  /**
   * The spacing between children.
   * This will be multiplied by 4 to get the actual dp value.
   * @default 0
   */
  spacing?: number;
  /**
   * Align items along the cross axis.
   */
  alignItems?: ViewStyle["alignItems"];
  /**
   * Justify content along the main axis.
   */
  justifyContent?: ViewStyle["justifyContent"];
  /**
   * Children to render.
   */
  children: ReactNode;
};

/**
 * A layout component for stacking children horizontally or vertically.
 * Uses the 'gap' property for spacing.
 *
 * @param {object} props - The component's props.
 * @param {'row' | 'column'} [props.direction='column'] - The direction of the stack.
 * @param {number} [props.spacing=0] - The spacing between children (multiplied by 4 for dp, applied as gap).
 * @param {ViewStyle['alignItems']} [props.alignItems] - Align items along the cross axis.
 * @param {ViewStyle['justifyContent']} [props.justifyContent] - Justify content along the main axis.
 * @param {ReactNode} props.children - Children to render.
 */
export const Stack = ({
  direction = "column",
  spacing = 0,
  alignItems,
  justifyContent,
  children,
}: StackProps) => {
  const gapValue = spacing * 4;
  const stackStyle: ViewStyle = {
    flexDirection: direction,
    alignItems,
    justifyContent,
    // Apply gap based on direction
    ...(direction === "row" ? { columnGap: gapValue } : { rowGap: gapValue }),
  };

  return <View style={stackStyle}>{children}</View>;
};
