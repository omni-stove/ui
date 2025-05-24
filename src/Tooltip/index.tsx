import {
  type ReactElement,
  cloneElement,
  useCallback,
  useEffect,
  useMemo, // Re-add useMemo
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  type LayoutRectangle,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type PressableStateCallbackType, // Import PressableStateCallbackType
} from "react-native";
import {
  Tooltip as PaperTooltip,
  type TooltipProps as PaperTooltipProps,
  Portal,
  Surface,
  Text,
  // type Theme, // Will use ReturnType<typeof useTheme> from local hook
} from "react-native-paper";
import { useTheme } from "../hooks"; // Import useTheme from local hooks

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

  // Add padding to prevent edge touching
  const padding = 8;

  // Check for left overflow
  if (idealX < padding) {
    idealX = padding;
  }

  // Check for right overflow
  // Ensure the tooltip doesn't go off the right edge
  if (idealX + tooltipWidth > layoutWidth - padding) {
    idealX = layoutWidth - tooltipWidth - padding;

    // After adjusting for right overflow, re-check for left overflow
    // This can happen if the tooltip is wider than the screen
    if (idealX < padding) {
      idealX = padding;
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
  visible,
}: RichTooltipProps) => {
  const isWeb = Platform.OS === "web";
  const theme = useTheme(); // Use local useTheme

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

  // Use internal state if visible prop is not provided
  const isActuallyVisible = visible !== undefined ? visible : internalVisible;

  const showTooltip = useCallback(() => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    if (visible === undefined) {
      // Small delay to show to prevent flickering when moving mouse between child and tooltip
      showTimeout.current = setTimeout(() => {
        setInternalVisible(true);
      }, 50); // Adjust delay as needed
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
      }, 500); // Significantly increased delay
    }
  }, [visible, isChildrenHovered, isTooltipHovered]);

  useEffect(() => {
    if (isChildrenHovered || isTooltipHovered) {
      showTooltip();
    } else {
      hideTooltip();
    }
  }, [isChildrenHovered, isTooltipHovered, showTooltip, hideTooltip]);

  // Cleanup timeouts on unmount
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
      setInternalVisible(true); // For touch devices, show immediately
    }
  }, [visible]);

  const handleTouchEnd = useCallback(() => {
    if (visible === undefined) {
      setInternalVisible(false); // For touch devices, hide immediately
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
                x: 0, // x and y for tooltip layout are relative to its parent (Portal)
                y: 0, // so they are not directly used for absolute positioning here.
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
      // Delay measurement to allow tooltip to render and get its layout
      // This is a common pattern when dealing with dynamic content size
      const timeoutId = setTimeout(measureLayouts, 0);
      return () => clearTimeout(timeoutId);
    }
    // Reset measurement when tooltip is hidden
    setMeasurement((prev) => ({ ...prev, measured: false }));
  }, [isActuallyVisible, measureLayouts]);

  const mobilePressProps = {
    onPress: handlePress,
    onLongPress: handleTouchStart, // For mobile, long press shows, press out hides
    onPressOut: handleTouchEnd,
  };

  const webPressProps = {
    onHoverIn: handleChildrenHoverIn,
    onHoverOut: handleChildrenHoverOut,
  };

  const dynamicStyles = useMemo(() => getDynamicStyles(theme), [theme]); // Re-add dynamicStyles

  return (
    <>
      {isActuallyVisible && (
        <Portal>
          <Pressable
            onPress={() => {
              if (visible === undefined) {
                // Clicking outside the tooltip content (on the portal backdrop) should hide it
                // if not controlled by `visible` prop.
                setIsChildrenHovered(false);
                setIsTooltipHovered(false);
                setInternalVisible(false);
              }
            }}
            style={StyleSheet.absoluteFillObject}
          />
          <Pressable
            pointerEvents="box-none" // Allows hover events on this, but passes touches to children
            onHoverIn={isWeb ? handleTooltipHoverIn : undefined}
            onHoverOut={isWeb ? handleTooltipHoverOut : undefined}
            // This Pressable is now the primary hover target for the entire tooltip area.
            // It should not interfere with clicks intended for the backdrop to close the tooltip,
            // nor should it block interactions with content like buttons IF pointerEvents works as expected.
          >
            <Surface
              pointerEvents="auto" // Ensures Surface and its children can receive touch/press events
              ref={tooltipRef}
              elevation={2}
              style={[
                staticStyles.surface, // Use staticStyles
                getTooltipPosition(measurement as Measurement),
                { opacity: measurement.measured && isActuallyVisible ? 1 : 0 },
              ]}
              testID="tooltip-container"
            >
              {subhead ? (
                <Text
                  style={[
                    staticStyles.subhead, // Use staticStyles
                    { color: theme.colors.onSurfaceVariant }, // Use theme color
                  ]}
                  variant="titleSmall"
                >
                  {subhead}
                </Text>
              ) : null}
              <Text
                style={{ color: theme.colors.onSurfaceVariant }} // Use theme color
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
                          dynamicStyles.actionButton, // Use dynamicStyles
                          isWeb &&
                            webState.hovered &&
                            dynamicStyles.actionButtonHovered, // Use dynamicStyles
                        ];
                      }}
                    >
                      <Text
                        style={[
                          dynamicStyles.actionButtonText, // Use dynamicStyles
                          { color: theme.colors.primary }, // Use theme color
                        ]}
                        variant="labelLarge" // Consistent with Paper Button text
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
        style={pressContainerStyle} // This remains as it's defined outside
        {...(isWeb ? webPressProps : mobilePressProps)}
      >
        {cloneElement(children, {
          ...(isWeb ? webPressProps : mobilePressProps),
        })}
      </Pressable>
    </>
  );
};

// Styles that don't depend on theme
const staticStyles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  // actionButton, actionButtonHovered, actionButtonText are now in getDynamicStyles
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

// pressContainerStyle is defined outside as it doesn't need theme for its current props
const pressContainerStyle = Platform.select({
  web: { cursor: "default" as "default" | undefined },
  default: {} as object,
});

// Helper function to create dynamic styles that depend on theme
const getDynamicStyles = (
  theme: ReturnType<typeof useTheme>, // Use ReturnType for theme
) =>
  StyleSheet.create({
    actionButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: theme.roundness * 2, // Use theme
      marginLeft: 8,
    },
    actionButtonHovered: {
      backgroundColor: Platform.select({
        web: theme.colors.primaryContainer, // Use theme
        default: undefined,
      }),
    },
    actionButtonText: {
      // fontWeight: 'bold', // Example, if needed
    },
    // Add other dynamic styles here if needed
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
