import {
  type ReactElement,
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  type LayoutRectangle,
  Platform,
  Pressable,
  type PressableStateCallbackType,
  StyleSheet,
  View,
} from "react-native";
import {
  Tooltip as PaperTooltip,
  type TooltipProps as PaperTooltipProps,
  Portal,
  Surface,
  Text,
} from "react-native-paper";
import { useTheme } from "../hooks";

/**
 * Represents the measurement of the child element that triggers the tooltip.
 * @param {number} width - The width of the child element.
 * @param {number} height - The height of the child element.
 * @param {number} pageX - The x-coordinate of the child element relative to the screen.
 * @param {number} pageY - The y-coordinate of the child element relative to the screen.
 */
type ChildrenMeasurement = {
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

/**
 * Represents the layout (dimensions) of the tooltip itself.
 * Inherits from `LayoutRectangle`.
 */
type TooltipLayout = LayoutRectangle;

/**
 * Contains all necessary measurements to calculate the tooltip's position.
 * @param {ChildrenMeasurement} children - Measurement of the child element.
 * @param {TooltipLayout} tooltip - Layout of the tooltip content.
 * @param {boolean} measured - Whether the measurements have been successfully taken.
 */
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

/**
 * Calculates the optimal X (horizontal) position for the tooltip.
 * It tries to center the tooltip above/below the child element,
 * while ensuring it doesn't overflow the screen edges.
 *
 * @param {ChildrenMeasurement} childrenMeasurement - The measurement of the child element.
 * @param {TooltipLayout} tooltipLayout - The layout of the tooltip.
 * @returns {number} The calculated left position for the tooltip.
 */
const getTooltipXPosition = (
  { pageX: childrenX, width: childrenWidth }: ChildrenMeasurement,
  { width: tooltipWidth }: TooltipLayout,
): number => {
  const { width: layoutWidth } = Dimensions.get("window");
  let idealX = childrenX + childrenWidth / 2 - tooltipWidth / 2;

  const padding = 8;
  if (idealX < padding) {
    idealX = padding;
  }

  if (idealX + tooltipWidth > layoutWidth - padding) {
    idealX = layoutWidth - tooltipWidth - padding;

    if (idealX < padding) {
      idealX = padding;
    }
  }
  return idealX;
};

/**
 * Calculates the optimal Y (vertical) position for the tooltip.
 * It places the tooltip below the child element by default, or above if
 * placing it below would cause it to overflow the bottom of the screen.
 *
 * @param {ChildrenMeasurement} childrenMeasurement - The measurement of the child element.
 * @param {TooltipLayout} tooltipLayout - The layout of the tooltip.
 * @returns {number} The calculated top position for the tooltip.
 */
const getTooltipYPosition = (
  { pageY: childrenY, height: childrenHeight }: ChildrenMeasurement,
  { height: tooltipHeight }: TooltipLayout,
): number => {
  if (overflowBottom(childrenY, childrenHeight, tooltipHeight)) {
    return childrenY - tooltipHeight;
  }

  return childrenY + childrenHeight;
};

/**
 * Calculates the absolute top and left position for the tooltip based on
 * the measurements of the child element and the tooltip itself.
 * Returns an empty object if measurements are not yet available.
 *
 * @param {Measurement} measurement - The combined measurement data.
 * @returns {Record<string, never> | { left: number; top: number }} The position object or an empty object.
 */
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

/**
 * Represents an action button within a RichTooltip.
 * @param {string} label - The text label for the action button.
 * @param {() => void} [onPress] - Callback function invoked when the action button is pressed.
 */
type Action = {
  label: string;
  onPress?: () => void;
};

/**
 * Props for the RichTooltip component.
 * @param {Action[]} [actions=[]] - An array of action buttons to display in the tooltip.
 * @param {ReactElement} children - The child element that triggers the tooltip. Must accept a ref.
 * @param {string} [subhead] - An optional sub-headline for the tooltip.
 * @param {string} supportingText - The main descriptive text of the tooltip.
 * @param {boolean} [visible] - Controls the visibility of the tooltip. If undefined, visibility is handled internally based on hover/press.
 */
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
  visible,
}: RichTooltipProps) => {
  const isWeb = Platform.OS === "web";
  const theme = useTheme();

  const [internalVisible, setInternalVisible] = useState(false);
  const [isChildrenHovered, setIsChildrenHovered] = useState(false);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  const [measurement, setMeasurement] = useState({
    children: {},
    tooltip: {},
    measured: false,
  });

  const childrenWrapperRef = useRef<View>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const showTimeout = useRef<NodeJS.Timeout | null>(null);

  const isActuallyVisible = visible !== undefined ? visible : internalVisible;

  const showTooltip = useCallback(() => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    if (visible === undefined) {
      showTimeout.current = setTimeout(() => {
        setInternalVisible(true);
      }, 50);
    }
  }, [visible]);

  const hideTooltip = useCallback(() => {
    if (showTimeout.current) {
      clearTimeout(showTimeout.current);
      showTimeout.current = null;
    }
    if (visible === undefined) {
      hideTimeout.current = setTimeout(() => {
        if (!isChildrenHovered && !isTooltipHovered) {
          setInternalVisible(false);
        }
      }, 500);
    }
  }, [visible, isChildrenHovered, isTooltipHovered]);

  useEffect(() => {
    if (isChildrenHovered || isTooltipHovered) {
      showTooltip();
    } else {
      hideTooltip();
    }
  }, [isChildrenHovered, isTooltipHovered, showTooltip, hideTooltip]);

  useEffect(() => {
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
      if (showTimeout.current) {
        clearTimeout(showTimeout.current);
      }
    };
  }, []);

  const handleTouchStart = useCallback(() => {
    if (visible === undefined) {
      setInternalVisible(true);
    }
  }, [visible]);

  const handleTouchEnd = useCallback(() => {
    if (visible === undefined) {
      setInternalVisible(false);
    }
  }, [visible]);

  const handlePress = useCallback(() => {
    if (visible === undefined) {
      setInternalVisible((prev) => !prev);
    }
    const originalOnPress = (children.props as { onPress?: () => void })
      .onPress;
    if (originalOnPress) {
      originalOnPress();
    }
  }, [visible, children]);

  const handleChildrenHoverIn = useCallback(() => {
    setIsChildrenHovered(true);
    const originalOnHoverIn = (children.props as { onHoverIn?: () => void })
      .onHoverIn;
    if (originalOnHoverIn) {
      originalOnHoverIn();
    }
  }, [children]);

  const handleChildrenHoverOut = useCallback(() => {
    setIsChildrenHovered(false);
    const originalOnHoverOut = (children.props as { onHoverOut?: () => void })
      .onHoverOut;
    if (originalOnHoverOut) {
      originalOnHoverOut();
    }
  }, [children]);

  const handleTooltipHoverIn = useCallback(() => {
    setIsTooltipHovered(true);
  }, []);

  const handleTooltipHoverOut = useCallback(() => {
    setIsTooltipHovered(false);
  }, []);

  const tooltipRef = useRef<View>(null);

  const measureLayouts = useCallback(() => {
    if (!childrenWrapperRef.current || !tooltipRef.current) {
      return;
    }

    childrenWrapperRef.current.measure(
      (_x, _y, cWidth, cHeight, cPageX, cPageY) => {
        tooltipRef.current?.measure(
          (__x, __y, tWidth, tHeight, _tPageX, _tPageY) => {
            setMeasurement({
              children: {
                pageX: cPageX,
                pageY: cPageY,
                height: cHeight,
                width: cWidth,
              },
              tooltip: {
                width: tWidth,
                height: tHeight,
                x: 0,
                y: 0,
              },
              measured: true,
            });
          },
        );
      },
    );
  }, []);

  useEffect(() => {
    if (isActuallyVisible) {
      const timeoutId = setTimeout(measureLayouts, 0);
      return () => clearTimeout(timeoutId);
    }
    setMeasurement((prev) => ({ ...prev, measured: false }));
  }, [isActuallyVisible, measureLayouts]);

  const mobilePressProps = {
    onPress: handlePress,
    onLongPress: handleTouchStart,
    onPressOut: handleTouchEnd,
  };

  const webPressProps = {
    onHoverIn: handleChildrenHoverIn,
    onHoverOut: handleChildrenHoverOut,
  };

  const dynamicStyles = useMemo(() => getDynamicStyles(theme), [theme]);

  return (
    <>
      {isActuallyVisible && (
        <Portal>
          <Pressable
            onPress={() => {
              if (visible === undefined) {
                setIsChildrenHovered(false);
                setIsTooltipHovered(false);
                setInternalVisible(false);
              }
            }}
            style={StyleSheet.absoluteFillObject}
          />
          <Pressable
            pointerEvents="box-none"
            onHoverIn={isWeb ? handleTooltipHoverIn : undefined}
            onHoverOut={isWeb ? handleTooltipHoverOut : undefined}
          >
            <Surface
              pointerEvents="auto"
              ref={tooltipRef}
              elevation={2}
              style={[
                staticStyles.surface,
                getTooltipPosition(measurement as Measurement),
                { opacity: measurement.measured && isActuallyVisible ? 1 : 0 },
              ]}
              testID="tooltip-container"
            >
              {subhead ? (
                <Text
                  style={[
                    staticStyles.subhead,
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
                <View style={staticStyles.actions}>
                  {actions.map((action) => (
                    <Pressable
                      key={action.label}
                      onPress={() => {
                        action.onPress?.();
                        if (visible === undefined) {
                          setIsChildrenHovered(false);
                          setIsTooltipHovered(false);
                          setInternalVisible(false);
                        }
                      }}
                      onHoverIn={isWeb ? handleTooltipHoverIn : undefined}
                      onHoverOut={isWeb ? handleTooltipHoverOut : undefined}
                      style={(state: PressableStateCallbackType) => {
                        const webState = state as PressableStateCallbackType & {
                          hovered?: boolean;
                        };
                        return [
                          dynamicStyles.actionButton,
                          isWeb &&
                            webState.hovered &&
                            dynamicStyles.actionButtonHovered,
                        ];
                      }}
                    >
                      <Text
                        style={[
                          dynamicStyles.actionButtonText,
                          { color: theme.colors.primary },
                        ]}
                        variant="labelLarge"
                      >
                        {action.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </Surface>
          </Pressable>
        </Portal>
      )}
      <Pressable
        ref={childrenWrapperRef}
        style={pressContainerStyle}
        {...(isWeb ? webPressProps : mobilePressProps)}
      >
        {cloneElement(children, {
          ...(isWeb ? webPressProps : mobilePressProps),
        })}
      </Pressable>
    </>
  );
};

const staticStyles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  surface: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
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

const pressContainerStyle = Platform.select({
  web: { cursor: "default" as "default" | undefined },
  default: {} as object,
});

const getDynamicStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    actionButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: theme.roundness * 2,
      marginLeft: 8,
    },
    actionButtonHovered: {
      backgroundColor: Platform.select({
        web: theme.colors.primaryContainer,
        default: undefined,
      }),
    },
    actionButtonText: {},
  });

/**
 * Props for the main Tooltip component.
 * It can render either a "plain" tooltip (using `react-native-paper`'s Tooltip)
 * or a "rich" tooltip (using the custom `RichTooltip` component).
 *
 * @param {"plain" | "rich"} [variant] - The variant of the tooltip to display.
 *                                      If "plain", `PaperTooltipProps` are expected.
 *                                      If "rich", `RichTooltipProps` are expected.
 * @param {ReactElement} children - The child element that will trigger the tooltip.
 *                                  For "rich" variant, it must accept a ref.
 *                                  For "plain" variant, it's passed directly to `PaperTooltip`.
 * @see {@link PaperTooltipProps}
 * @see {@link RichTooltipProps}
 */
type TooltipProps = (
  | ({ variant?: "plain" } & PaperTooltipProps)
  | ({ variant: "rich" } & RichTooltipProps)
) & { children: ReactElement };

/**
 * A Tooltip component that can display either a simple "plain" tooltip
 * (wrapping `react-native-paper`'s `Tooltip`) or a more complex "rich" tooltip
 * with subheadings, supporting text, and action buttons, adhering to M3 guidelines.
 *
 * The `variant` prop determines which type of tooltip is rendered.
 *
 * @param {TooltipProps} props - The component's props, varying based on the `variant`.
 * @returns {JSX.Element} The Tooltip component.
 * @see {@link https://callstack.github.io/react-native-paper/docs/components/Tooltip/|React Native Paper Tooltip} (for "plain" variant)
 * @see {@link RichTooltip} (for "rich" variant)
 */
export const Tooltip = (props: TooltipProps) => {
  if (props.variant === "rich") {
    const { variant, ...rest } = props;
    return <RichTooltip {...rest} />;
  }
  const { variant, children, ...rest } = props;
  return <PaperTooltip {...rest}>{children}</PaperTooltip>;
};
