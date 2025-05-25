import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
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
  /**
   * Optional custom style for the divider.
   */
  style?: StyleProp<ViewStyle>;
};

/**
 * A divider component that can be oriented horizontally or vertically.
 * Based on React Native Paper's Divider with additional orientation support.
 */
export const Divider = ({
  orientation = "horizontal",
  inset = false,
  ...rest
}: Props) => {
  const theme = useTheme();

  if (orientation === "horizontal") {
    return <PaperDivider {...rest} style={[inset && styles.horizontalInset]} />;
  }

  return (
    <View
      style={[
        styles.verticalDivider,
        {
          backgroundColor: theme.colors.outlineVariant,
        },
        inset && styles.verticalInset,
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
