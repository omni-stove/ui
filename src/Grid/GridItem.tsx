import { View } from "react-native";
import { useMaxColumns } from "./hooks";
import type { GridItemProps } from "./types";
import { getSpacingValue } from "./utils";

type GridItemPropsExtended = GridItemProps & {
  spacing?: number | "compact" | "comfortable" | "spacious";
};

export const GridItem = ({
  children,
  span = 1,
  spacing = "comfortable",
  style,
  ...props
}: GridItemPropsExtended) => {
  const currentColumns = useMaxColumns();
  const spacingValue = getSpacingValue(spacing);

  // 親要素の幅から取得したカラム数に基づいて幅を計算
  // spanが現在のカラム数を超える場合は100%幅にする
  const actualSpan = Math.min(span, currentColumns);
  const widthPercentage = (actualSpan / currentColumns) * 100;

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
