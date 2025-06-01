"use client";
import type { ComponentRef } from "react";
import { forwardRef, useEffect, useState } from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import {
  Badge,
  Icon,
  Modal,
  Portal,
  TouchableRipple,
} from "react-native-paper";
import { FAB, IconButton } from "react-native-paper";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Typography } from "../Typography";
import { useTheme } from "../hooks";

/**
 * Defines the display variant of the NavigationRail.
 * - `standard`: A persistent rail typically shown on the left side of the screen.
 * - `modal`: A rail that appears as a modal, often triggered by a menu button.
 */
type Variant = "standard" | "modal";

/**
 * Represents a single item in the NavigationRail.
 * @param {string} key - A unique key for the navigation item.
 * @param {IconSource} icon - The icon to display for the item.
 * @param {string} label - The text label for the item.
 * @param {() => void} onPress - Function to call when the item is pressed.
 * @param {object} [badge] - Optional badge configuration for the item.
 * @param {string} badge.label - The text content of the badge.
 * @param {"small" | "large"} [badge.size] - The size of the badge.
 * @param {string} [ariaLabel] - Accessibility label for the item.
 * @param {string} [testID] - Test ID for the item.
 */
export type NavigationRailItem = {
  key: string;
  icon: IconSource;
  label: string;
  onPress: () => void;
  badge?: {
    label: string;
    size?: "small" | "large";
  };
  ariaLabel?: string;
  testID?: string;
};

/**
 * Props for the NavigationRail component.
 * @param {Variant} [variant="standard"] - The display variant of the NavigationRail.
 * @param {NavigationRailItem[]} items - An array of navigation items to display.
 * @param {string} selectedItemKey - The key of the currently selected navigation item.
 * @param {() => void} [onMenuPress] - Callback function invoked when the internal menu button (for expanding/collapsing or closing modal) is pressed.
 * @param {IconSource} [fabIcon] - Icon for the Floating Action Button (FAB) within the rail.
 * @param {string} [fabLabel] - Label for the FAB (visible when the rail is expanded).
 * @param {() => void} [onFabPress] - Callback function invoked when the FAB is pressed.
 * @param {Status} [initialStatus="collapsed"] - Initial expanded/collapsed status for the `standard` variant. Ignored for `modal` variant (always starts expanded within modal).
 * @param {boolean} [initialModalOpen=false] - For `modal` variant, defines if the modal is initially open.
 * @param {() => void} [onDismiss] - For `modal` variant, callback function invoked when the modal is dismissed.
 */
type Props = {
  variant?: Variant;
  items: NavigationRailItem[];
  selectedItemKey: string;
  onMenuPress?: () => void;
  fabIcon?: IconSource;
  fabLabel?: string;
  onFabPress?: () => void;
  initialStatus?: Status;
  initialModalOpen?: boolean;
  onDismiss?: () => void;
};

/**
 * Defines the expanded or collapsed status of the NavigationRail (primarily for `standard` variant).
 * - `collapsed`: The rail is narrow, showing only icons.
 * - `expanded`: The rail is wider, showing icons and labels.
 */
type Status = "collapsed" | "expanded";

/**
 * NavigationRail provides a side navigation component, conforming to Material Design 3 guidelines.
 * It supports two main variants: `standard` (a persistent rail) and `modal` (a rail appearing in a modal).
 * The rail can be expanded or collapsed, can include a FAB, and navigation items can display badges.
 *
 * @param {Props} props - The component's props.
 * @param {ComponentRef<typeof View>} ref - Ref for the main animated View container of the rail.
 * @returns {JSX.Element} The NavigationRail component.
 */
export const NavigationRail = forwardRef<ComponentRef<typeof View>, Props>(
  (
    {
      items,
      selectedItemKey,
      onMenuPress,
      fabIcon,
      fabLabel,
      onFabPress,
      initialStatus = "collapsed",
      variant = "standard",
      initialModalOpen = false,
      onDismiss,
    }: Props,
    ref,
  ) => {
    const theme = useTheme();
    const [status, setStatus] = useState<Status>(
      variant === "modal" ? "expanded" : initialStatus,
    );
    const [isModalOpen, setIsModalOpen] = useState(
      variant === "modal" ? initialModalOpen : false,
    );

    const toggleRailStatus = () => {
      setStatus((prev) => (prev === "collapsed" ? "expanded" : "collapsed"));
    };

    const toggleModalVisibility = () => {
      if (variant === "modal") {
        setIsModalOpen((prev) => !prev);
      }
    };

    const styles = StyleSheet.create({
      fixedGlobalMenuButton: {
        position: "absolute",
        top: 8,
        left: 16,
        zIndex: 1002,
        backgroundColor: "transparent",
        borderRadius: theme.roundness * 4,
      },
      container: {
        backgroundColor: theme.colors.surfaceContainer,
        paddingTop: 8,
        paddingBottom: 8,
        height: "100%",
        overflow: "hidden",
      },
      menuButtonContainer: {
        marginBottom: 36,
        width: "100%",
        alignItems: status === "expanded" ? "flex-start" : "center",
        paddingHorizontal: status === "expanded" ? 16 : 0,
      },
      fabContainer: {
        alignItems: status === "expanded" ? "flex-start" : "center",
        width: "100%",
        paddingHorizontal: status === "expanded" ? 16 : 0,
        marginBottom: 24,
      },
      itemContainer: {
        width: "100%",
        alignItems: "center",
        paddingVertical: 8,
        borderRadius: theme.roundness * 3,
        marginBottom: 6,
        minHeight: 68,
        justifyContent: "center",
      },
      activeItemBackground: {},
      itemContent: {
        alignItems: "center",
        flexDirection: "column",
      },
      iconContainer: {
        width: 56,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.roundness * 4,
      },
      activeIconContainer: {
        backgroundColor: theme.colors.secondaryContainer,
      },
      label: {
        // Styles for Typography will be handled by its own props or specific style overrides if necessary
        marginTop: 4,
        textAlign: "center",
        // color: theme.colors.onSurfaceVariant, // Handled by Typography color prop
        // ...theme.fonts.labelMedium, // Handled by Typography variant prop
      },
      activeLabel: {
        // color: theme.colors.onSurfaceVariant, // Handled by Typography color prop
      },
      expandedItemWrapper: {
        width: "100%",
        marginBottom: 12,
        alignItems: "flex-start",
        paddingHorizontal: 16,
      },
      expandedFab: {
        alignSelf: "flex-start",
        minHeight: 56,
        justifyContent: "flex-start",
        backgroundColor: "transparent",
        elevation: 0,
        shadowColor: "transparent",
      },
      activeExpandedFab: {
        backgroundColor: theme.colors.secondaryContainer,
      },
      expandedBadgeOffset: {
        position: "absolute",
        top: 8,
        left: 44,
      },
      modalContentContainer: {
        backgroundColor: theme.colors.surface,
        height: "100%",
        maxWidth: 360,
        borderTopRightRadius: theme.roundness * 4,
        borderBottomRightRadius: theme.roundness * 4,
        overflow: "hidden",
      },
    });

    const getBadgeStyleAndSize = (
      badge?: NavigationRailItem["badge"],
    ): { style: StyleProp<ViewStyle>; RNPBadgeSize: number } => {
      if (!badge) return { style: {}, RNPBadgeSize: 0 };

      const RNPBadgeSizeConfig = {
        small: 6,
        largeSingleDigit: 16,
        largeMultiCharHeight: 16,
        largeMultiCharWidth: 34,
      };

      let RNPBadgeSize: number;
      let calculatedTop: number;
      let calculatedRight: number;
      let badgeWidth: number | undefined = undefined;
      let badgeHeight: number | undefined = undefined;

      if (badge.size === "small") {
        RNPBadgeSize = RNPBadgeSizeConfig.small;
        badgeHeight = 6;
        badgeWidth = 6;
        calculatedTop = 0;
        calculatedRight = 8;
      } else {
        RNPBadgeSize = RNPBadgeSizeConfig.largeSingleDigit;
        badgeHeight = 16;

        if (badge.label && badge.label.length > 1) {
          badgeWidth = RNPBadgeSizeConfig.largeMultiCharWidth;
        } else {
          badgeWidth = RNPBadgeSizeConfig.largeSingleDigit;
        }

        calculatedTop = 0;
        calculatedRight = 8;
      }

      return {
        style: {
          position: "absolute",
          top: calculatedTop,
          right: calculatedRight,
          width: badgeWidth,
          height: badgeHeight,
        },
        RNPBadgeSize: RNPBadgeSize,
      };
    };

    const handleInternalMenuPress = () => {
      if (variant === "modal") {
        setIsModalOpen(false);
        if (onMenuPress) {
          onMenuPress();
        }
      } else {
        toggleRailStatus();
        if (onMenuPress) {
          onMenuPress();
        }
      }
    };

    const animatedWidth = useSharedValue(status === "expanded" ? 220 : 80);
    const animatedAlignment = useSharedValue(status === "expanded" ? 1 : 0);

    const ANIMATION_DURATION = 280;

    useEffect(() => {
      animatedWidth.value = withTiming(status === "expanded" ? 220 : 80, {
        duration: ANIMATION_DURATION,
      });
      animatedAlignment.value = withTiming(status === "expanded" ? 1 : 0, {
        duration: ANIMATION_DURATION,
      });
    }, [status, animatedWidth, animatedAlignment]);

    const animatedContainerStyle = useAnimatedStyle(() => {
      return {
        width: status === "expanded" ? "auto" : animatedWidth.value,
        minWidth: status === "expanded" ? 220 : 80,
        maxWidth: 360,
        alignItems: animatedAlignment.value === 0 ? "center" : "flex-start",
      };
    });

    const railContent = (
      <Animated.View
        style={[styles.container, animatedContainerStyle]}
        ref={ref}
      >
        {/* Internal Menu button */}
        <View style={styles.menuButtonContainer}>
          <IconButton
            icon={status === "expanded" ? "menu-open" : "menu"}
            onPress={handleInternalMenuPress}
            size={24}
            accessibilityLabel={
              status === "expanded" ? "Collapse rail" : "Expand rail"
            }
          />
        </View>
        {onFabPress && fabIcon && (
          <View style={styles.fabContainer}>
            <FAB
              icon={fabIcon}
              label={status === "expanded" ? fabLabel : undefined}
              onPress={onFabPress}
              variant="primary"
            />
          </View>
        )}
        {items.map((item) => {
          const isActive = item.key === selectedItemKey;
          const badgeStyles = getBadgeStyleAndSize(item.badge);

          const itemAnimatedStyle = useAnimatedStyle(() => {
            return {
              opacity:
                status === "expanded"
                  ? animatedAlignment.value
                  : 1 - animatedAlignment.value,
            };
          });

          const collapsedItemAnimatedStyle = useAnimatedStyle(() => {
            return {
              opacity:
                status === "collapsed"
                  ? 1 - animatedAlignment.value
                  : animatedAlignment.value,
            };
          });

          return (
            <View key={item.key} style={{ width: "100%" }}>
              {/* Expanded Item */}
              <Animated.View
                style={[
                  styles.expandedItemWrapper,
                  itemAnimatedStyle,
                  { display: status === "expanded" ? "flex" : "none" },
                ]}
              >
                <FAB
                  icon={item.icon}
                  label={item.label}
                  onPress={item.onPress}
                  style={[
                    styles.expandedFab,
                    isActive && styles.activeExpandedFab,
                  ]}
                  theme={{ roundness: theme.roundness * 3 }}
                  color={
                    isActive
                      ? theme.colors.onSecondaryContainer
                      : theme.colors.onSurfaceVariant
                  }
                  accessibilityLabel={item.ariaLabel || item.label}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  testID={item.testID}
                />
                {item.badge && (
                  <Badge
                    style={[badgeStyles.style, styles.expandedBadgeOffset]}
                    size={badgeStyles.RNPBadgeSize}
                    visible={status === "expanded"}
                  >
                    {item.badge.label}
                  </Badge>
                )}
              </Animated.View>

              {/* Collapsed Item */}
              <Animated.View
                style={[
                  { display: status === "collapsed" ? "flex" : "none" },
                  collapsedItemAnimatedStyle,
                ]}
              >
                <TouchableRipple
                  onPress={item.onPress}
                  style={[
                    styles.itemContainer,
                    isActive && styles.activeItemBackground,
                  ]}
                  accessibilityLabel={item.ariaLabel || item.label}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  testID={item.testID}
                  borderless
                >
                  <View style={styles.itemContent}>
                    <View
                      style={[
                        styles.iconContainer,
                        isActive && styles.activeIconContainer,
                      ]}
                    >
                      <Icon
                        source={item.icon}
                        size={24}
                        color={
                          isActive
                            ? theme.colors.onSecondaryContainer
                            : theme.colors.onSurfaceVariant
                        }
                      />
                      {item.badge && (
                        <Badge
                          style={badgeStyles.style}
                          size={badgeStyles.RNPBadgeSize}
                          visible={status === "collapsed"}
                        >
                          {item.badge.label}
                        </Badge>
                      )}
                    </View>
                    <View
                      style={[styles.label, isActive && styles.activeLabel]}
                    >
                      <Typography
                        variant="labelMedium"
                        color={isActive ? "onSurface" : "onSurfaceVariant"}
                      >
                        {item.label}
                      </Typography>
                    </View>
                  </View>
                </TouchableRipple>
              </Animated.View>
            </View>
          );
        })}
      </Animated.View>
    );

    if (variant === "modal") {
      return (
        <>
          {/* Button to toggle modal visibility, only visible when modal is closed */}
          {variant === "modal" && !isModalOpen && (
            <Portal>
              <IconButton
                icon={"menu"}
                onPress={toggleModalVisibility}
                style={styles.fixedGlobalMenuButton}
                size={24}
                accessibilityLabel={"Open navigation modal"}
              />
            </Portal>
          )}

          {variant === "modal" && (
            <Portal>
              <Modal
                visible={isModalOpen}
                onDismiss={() => {
                  setIsModalOpen(false);
                  if (onDismiss) {
                    onDismiss();
                  }
                }}
                contentContainerStyle={styles.modalContentContainer}
                style={{ alignItems: "flex-start" }}
              >
                {railContent}
              </Modal>
            </Portal>
          )}
        </>
      );
    }

    return railContent;
  },
);
