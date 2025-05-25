import type React from "react";
import { StyleSheet, View } from "react-native";
import { Divider as PaperDivider } from "react-native-paper";
import type { DividerProps as PaperDividerProps } from "react-native-paper";
import { useTheme } from "../hooks";

/**
 * Props for the Divider component.
 */
type Props = PaperDividerProps & {
  /**
   * The orientation of the divider.
   * @default 'horizontal'
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Whether to apply an inset style to the divider.
   * Inset dividers do not span the full width or height of their container.
   * @default false
   */
  inset?: boolean;
};

/**
 * A divider component that can be oriented horizontally or vertically.
 * Based on React Native Paper's Divider with additional orientation support.
 */
export const Divider: React.FC<Props> = ({
  orientation = "horizontal",
  inset = false,
  style,
  ...rest
}) => {
  const theme = useTheme();

  if (orientation === "horizontal") {
    return (
      <PaperDivider
        {...rest}
        style={[inset && styles.horizontalInset, style]}
      />
    );
  }

  // Vertical divider implementation
  return (
    <View
      style={[
        styles.verticalDivider,
        {
          backgroundColor: theme.colors.outlineVariant,
        },
        inset && styles.verticalInset,
        style,
      ]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  verticalDivider: {
    width: 1,
    height: "100%",
    alignSelf: "stretch",
  },
  horizontalInset: {
    marginHorizontal: 16,
  },
  verticalInset: {
    marginVertical: 16,
  },
});
