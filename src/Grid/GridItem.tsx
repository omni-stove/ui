import { View } from "react-native";
import { useMaxColumns } from "./hooks";
import type { GridItemProps } from "./types";
import { getSpacingValue } from "./utils";

/**
 * Extended props for the GridItem component, including spacing options.
 * @augments GridItemProps
 * @param {number | "compact" | "comfortable" | "spacious"} [spacing="comfortable"] - The spacing around the grid item. Inherits from the parent Grid if not specified, but can be overridden.
 */
type GridItemPropsExtended = GridItemProps & {
  spacing?: number | "compact" | "comfortable" | "spacious";
};

/**
 * A GridItem component designed to be used as a child of the `Grid` component,
 * particularly in `standard` mode. It allows specifying how many columns
 * the item should span within the grid.
 *
 * The width of the GridItem is calculated based on the `span` prop and the
 * total number of columns available in the parent `Grid`.
 *
 * @param {GridItemPropsExtended} props - The component's props.
 * @returns {JSX.Element} The GridItem component.
 * @see {@link Grid}
 * @see {@link GridItemProps}
 */
export const GridItem = ({
  children,
  span = 1,
  spacing = "comfortable",
  style,
  ...props
}: GridItemPropsExtended) => {
  const currentColumns = useMaxColumns();
  const spacingValue = getSpacingValue(spacing);

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
