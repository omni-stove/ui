import { Children, useMemo, useState } from "react";
import { type LayoutChangeEvent, View } from "react-native";
import { useMasonryLayout, useResponsiveColumns } from "./hooks";
import type { GridProps, MasonryItem } from "./types";
import { getSpacingValue } from "./utils";

export { GridItem } from "./GridItem";

export const Grid = ({
  columns = "auto",
  spacing = "comfortable",
  margin = 16,
  children,
  style,
  variant = "masonry",
}: GridProps) => {
  // Standard Grid の場合は直接実装
  if (variant === "standard") {
    const spacingValue = getSpacingValue(spacing);

    return (
      <View style={[{ margin }, style]}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginHorizontal: -spacingValue / 2,
          }}
        >
          {children}
        </View>
      </View>
    );
  }

  // Masonry Grid の実装（既存のロジック）
  const [containerWidth, setContainerWidth] = useState(0);
  const [itemHeights, setItemHeights] = useState<Map<string, number>>(
    new Map(),
  );

  const responsiveColumns = useResponsiveColumns(columns);
  const spacingValue = getSpacingValue(spacing);

  // 子要素をMasonryItemに変換
  const masonryItems = useMemo(() => {
    return (
      (Children.map(children, (child, index) => {
        const id = `item-${index}`;
        const height = itemHeights.get(id) || 200; // デフォルト高さ

        return {
          id,
          height,
          component: (
            <View
              key={id}
              onLayout={(event: LayoutChangeEvent) => {
                const { height } = event.nativeEvent.layout;
                setItemHeights((prev) => new Map(prev).set(id, height));
              }}
            >
              {child}
            </View>
          ),
        };
      }) as MasonryItem[]) || []
    );
  }, [children, itemHeights]);

  const { positions, totalHeight } = useMasonryLayout(
    masonryItems,
    responsiveColumns,
    spacingValue,
    containerWidth - margin * 2,
  );

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={[{ margin }, style]} onLayout={handleContainerLayout}>
      <View style={{ height: totalHeight, position: "relative" }}>
        {masonryItems.map((item, index) => {
          const position = positions[index];
          if (!position) return null;

          return (
            <View
              key={item.id}
              style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                width: position.width,
              }}
            >
              {item.component}
            </View>
          );
        })}
      </View>
    </View>
  );
};
