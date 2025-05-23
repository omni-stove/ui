import { View } from "react-native";
import type { GridItemProps } from "./types";
import { getSpacingValue } from "./utils";

type GridItemPropsExtended = GridItemProps & {
  columns?: number;
  spacing?: number | "compact" | "comfortable" | "spacious";
};

export const GridItem = ({
  children,
  span = 1,
  columns = 12,
  spacing = "comfortable",
  style,
  ...props
}: GridItemPropsExtended) => {
  const spacingValue = getSpacingValue(spacing);
  const widthPercentage = (span / columns) * 100;

  return (
    <View
      style={[
        {
          width: `${widthPercentage}%`,
          paddingHorizontal: spacingValue / 2,
          marginBottom: spacingValue,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
