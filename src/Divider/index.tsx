import { StyleSheet, View } from "react-native";
import { Divider as PaperDivider } from "react-native-paper";
import { useTheme } from "../hooks";

/**
 * Props for the Divider component.
 */
type Props = {
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
 *
 * @param {Props} props - The component's props.
 * @param {"horizontal" | "vertical"} [props.orientation="horizontal"] - The orientation of the divider.
 * @param {boolean} [props.inset=false] - Whether to apply an inset style to the divider.
 * @returns {JSX.Element} The Divider component.
 */
export const Divider = ({
  orientation = "horizontal",
  inset = false,
}: Props) => {
  const theme = useTheme();

  if (orientation === "horizontal") {
    return <PaperDivider style={inset && styles.horizontalInset} />;
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
