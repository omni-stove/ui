import {
  type ReactElement,
  cloneElement,
  isValidElement,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  type LayoutChangeEvent,
  type LayoutRectangle,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Tooltip as PaperTooltip,
  type TooltipProps as PaperTooltipProps,
  Portal,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";

// react-native paper currently lacks a rich tooltip component:
// https://github.com/callstack/react-native-paper/issues/4074

type ChildrenMeasurement = {
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

type TooltipLayout = LayoutRectangle;

export type Measurement = {
  children: ChildrenMeasurement;
  tooltip: TooltipLayout;
  measured: boolean;
};

/**
 * Return true when the children y-coordinate + its height + tooltip height is greater than the layout height.
 * The tooltip will be placed at the top of the wrapped element.
 */
const overflowBottom = (
  childrenY: number,
  childrenHeight: number,
  tooltipHeight: number,
): boolean => {
  const { height: layoutHeight } = Dimensions.get("window");

  return childrenY + childrenHeight + tooltipHeight > layoutHeight;
};

const getTooltipXPosition = (
  { pageX: childrenX, width: childrenWidth }: ChildrenMeasurement,
  { width: tooltipWidth }: TooltipLayout,
): number => {
  const { width: layoutWidth } = Dimensions.get("window");
  let idealX = childrenX + childrenWidth / 2 - tooltipWidth / 2;

  // Check for left overflow
  if (idealX < 0) {
    idealX = 0; // Consider adding a small padding if needed
  }

  // Check for right overflow
  // Ensure the tooltip doesn't go off the right edge
  if (idealX + tooltipWidth > layoutWidth) {
    idealX = layoutWidth - tooltipWidth; // Consider subtracting padding if needed

    // After adjusting for right overflow, re-check for left overflow
    // This can happen if the tooltip is wider than the screen
    if (idealX < 0) {
      idealX = 0;
    }
  }
  return idealX;
};

const getTooltipYPosition = (
  { pageY: childrenY, height: childrenHeight }: ChildrenMeasurement,
  { height: tooltipHeight }: TooltipLayout,
): number => {
  if (overflowBottom(childrenY, childrenHeight, tooltipHeight)) {
    return childrenY - tooltipHeight;
  }

  // We assume that we can't both overflow bottom and top.
  return childrenY + childrenHeight;
};

export const getTooltipPosition = ({
  children,
  tooltip,
  measured,
}: Measurement): Record<string, never> | { left: number; top: number } => {
  if (!measured) {
    return {};
  }

  return {
    left: getTooltipXPosition(children, tooltip),
    top: getTooltipYPosition(children, tooltip),
  };
};

type Action = {
  label: string;
  onPress?: () => void;
};

type RichTooltipProps = {
  actions?: Action[];
  children: ReactElement;
  subhead?: string;
  supportingText: string;
  visible?: boolean;
};

/**
 * Material Design 3 rich tooltip.
 *
 * Note that `children` must be a React element with a ref of type `View`.
 *
 * See https://m3.material.io/components/tooltips/overview.
 */
const RichTooltip = ({
  actions = [],
  children,
  subhead,
  supportingText,
  visible = false,
}: RichTooltipProps) => {
  const theme = useTheme();

  const [measurement, setMeasurement] = useState<{
    children: Partial<ChildrenMeasurement>;
    tooltip: Partial<TooltipLayout>;
    measured: boolean;
  }>({
    children: {},
    tooltip: {},
    measured: false,
  });
  const childrenRef = useRef<View>(null);

  const handleOnLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    if (childrenRef.current) {
      childrenRef.current.measureInWindow((pageX, pageY, width, height) => {
        setMeasurement({
          children: { pageX, pageY, height, width },
          tooltip: { ...layout },
          measured: true,
        });
      });
    }
  };

  return (
    <>
      {visible && (
        <Portal>
          <Surface
            elevation={2}
            onLayout={handleOnLayout}
            style={[
              styles.surface,
              {
                ...getTooltipPosition(measurement as Measurement),
                ...(measurement.measured ? styles.visible : styles.hidden),
              },
            ]}
            testID="tooltip-container"
          >
            {subhead ? (
              <Text
                style={[
                  styles.subhead,
                  { color: theme.colors.onSurfaceVariant },
                ]}
                variant="titleSmall"
              >
                {subhead}
              </Text>
            ) : null}
            <Text
              style={{ color: theme.colors.onSurfaceVariant }}
              variant="bodyMedium"
            >
              {supportingText}
            </Text>
            {actions && actions.length > 0 ? (
              <View style={styles.actions}>
                {actions.map((action) => (
                  <Button
                    key={action.label}
                    mode="text"
                    onPress={() => action.onPress?.()}
                  >
                    {action.label}
                  </Button>
                ))}
              </View>
            ) : null}
          </Surface>
        </Portal>
      )}
      {isValidElement(children)
        ? cloneElement(children as ReactElement<any>, { ref: childrenRef })
        : children}
    </>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    marginTop: 12,
  },
  surface: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
    // The MD3 spec doesn't specify the width but this is the max width of the
    // tooltip used in the Jetpack implementation. This includes the padding.
    maxWidth: 320 - 2 * 16,
  },
  subhead: {
    marginBottom: 4,
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
});

type TooltipProps = (
  | ({ variant?: "plain" } & PaperTooltipProps)
  | ({ variant: "rich" } & RichTooltipProps)
) & { children: ReactElement }; // Ensure children is always present

export const Tooltip = (props: TooltipProps) => {
  if (props.variant === "rich") {
    const { variant, ...rest } = props;
    return <RichTooltip {...rest} />;
  }
  const { variant, children, ...rest } = props;
  return <PaperTooltip {...rest}>{children}</PaperTooltip>;
};
