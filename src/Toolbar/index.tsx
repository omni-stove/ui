import type { Ref } from "react";
import { forwardRef, useLayoutEffect, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Dimensions, Platform, StatusBar, View } from "react-native";
import { Icon, TouchableRipple } from "react-native-paper";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { Menu } from "../Menu";
import { useTheme } from "../hooks";

/**
 * Defines the visual variant of the Toolbar.
 * - `docked`: A toolbar docked to the edge of the screen, typically the bottom.
 * - `floating`: A toolbar that floats above the content, with rounded corners and elevation.
 */
type Variant = "docked" | "floating";

/**
 * Defines the alignment of the actions within the Toolbar.
 * - `start`: Actions are aligned to the start (left).
 * - `center`: Actions are centered.
 */
type Alignment = "start" | "center";

/**
 * Defines the color theme of the Toolbar.
 * - `standard`: Default Material Design 3 color scheme using surface-container background.
 * - `vibrant`: High-contrast Material Design 3 color scheme using primary-container background.
 */
type Color = "standard" | "vibrant";

/**
 * Represents a single action item in the Toolbar.
 * @param {IconSource} icon - The icon to display for the action.
 * @param {() => void} onPress - Function to call when the action is pressed.
 * @param {string} [accessibilityLabel] - Accessibility label for the action.
 * @param {string} [testID] - Test ID for the action.
 */
type ActionItem = {
  icon: IconSource;
  onPress: () => void;
  accessibilityLabel?: string;
  testID?: string;
};

/**
 * Props for the Toolbar component.
 * @param {Variant} [props.variant="floating"] - The visual variant of the Toolbar.
 * @param {Color} [props.color="standard"] - The color theme of the Toolbar.
 * @param {Alignment} [props.alignment="center"] - The alignment of action items within the Toolbar.
 * @param {IconSource} [props.navigationIcon] - Icon to display for navigation (e.g., back arrow, menu).
 * @param {() => void} [props.onNavigationPress] - Callback function invoked when the navigation icon is pressed.
 * @param {ActionItem[]} [props.actions=[]] - An array of action items to display in the Toolbar.
 * @param {string} [props.testID] - Test ID for the Toolbar.
 * @param {string} [props.accessibilityLabel] - Accessibility label for the Toolbar.
 * @param {object} [props.fab] - Configuration for a Floating Action Button (FAB) to be displayed with the Toolbar.
 * @param {IconSource} props.fab.icon - The icon for the FAB.
 * @param {() => void} props.fab.onPress - Function to call when the FAB is pressed.
 * @param {string} [props.fab.accessibilityLabel] - Accessibility label for the FAB.
 * @param {string} [props.fab.testID] - Test ID for the FAB.
 */
type Props = {
  /** Toolbar variant */
  variant?: Variant;
  /** Toolbar color theme */
  color?: Color;
  /** Action alignment */
  alignment?: Alignment;
  /** Navigation icon */
  navigationIcon?: IconSource;
  /** Navigation icon press handler */
  onNavigationPress?: () => void;
  /** Action items */
  actions?: ActionItem[];
  /** Test ID */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** FAB configuration - displays on the right side of the toolbar */
  fab?: {
    icon: IconSource;
    onPress: () => void;
    accessibilityLabel?: string;
    testID?: string;
  };
};

const toolbarDimensions = {
  height: 64,
  paddingHorizontal: 16,
};

/**
 * A Toolbar component adhering to Material Design 3 (M3) specifications.
 * It supports `docked` and `floating` variants and can include
 * a navigation icon, action items, and a Floating Action Button (FAB).
 *
 * @param {Props} props - The component's props.
 * @param {Ref<View>} ref - Ref for the main container View.
 * @returns {JSX.Element} The Toolbar component.
 * @see {@link https://m3.material.io/components/bottom-app-bar/specs|Material Design 3 - Bottom app bar}
 */
export const Toolbar = forwardRef<View, Props>(
  (
    {
      variant = "floating",
      color = "standard",
      alignment = "center",
      navigationIcon,
      onNavigationPress,
      actions = [],
      fab,
      testID,
      accessibilityLabel,
    },
    ref: Ref<View>,
  ) => {
    const theme = useTheme();
    console.log("Toolbar color:", color);
    const [screenWidth, setScreenWidth] = useState(
      Dimensions.get("window").width,
    );
    const [menuVisible, setMenuVisible] = useState(false);

    useLayoutEffect(() => {
      const subscription = Dimensions.addEventListener(
        "change",
        ({ window }) => {
          setScreenWidth(window.width);
        },
      );
      return () => subscription?.remove();
    }, []);

    const calculateMaxVisibleActions = () => {
      const actionButtonWidth = 48; // Action button width
      const gapBetweenActions = 32; // Gap between action items
      const paddingHorizontal = toolbarDimensions.paddingHorizontal; // Container padding (16px)
      const navigationButtonWidth = navigationIcon ? 48 : 0; // Navigation button width
      const navigationToActionsGap = navigationIcon ? 32 : 0; // Gap between navigation and actions
      const fabWidth = fab ? 56 : 0; // FAB width
      const fabPaddingRight = fab ? 16 : 0; // Extra padding when FAB is present (or gap for floating)
      const floatingMargin = variant === "floating" ? 32 : 0; // Floating margin (16px each side)

      // Calculate available width for actions
      const usedWidth =
        paddingHorizontal * 2 +
        navigationButtonWidth +
        navigationToActionsGap +
        fabWidth +
        fabPaddingRight +
        floatingMargin;
      const availableWidth = screenWidth - usedWidth;

      if (actions.length === 0) return 0;

      // Calculate width needed for all actions (no gaps before first action)
      const allActionsWidth =
        actions.length * actionButtonWidth +
        (actions.length - 1) * gapBetweenActions;

      // If we can fit all actions without menu, show all
      if (allActionsWidth <= availableWidth) {
        return actions.length;
      }

      // Otherwise, calculate how many we can fit with menu button
      // Menu button needs same width as action + gap before it
      const menuButtonWidth = actionButtonWidth + gapBetweenActions;
      const availableForActions = availableWidth - menuButtonWidth;

      // Calculate how many actions fit: first action (no gap) + additional actions (with gaps)
      let maxActions = 0;
      let currentWidth = 0;

      for (let i = 0; i < actions.length; i++) {
        const nextWidth =
          currentWidth + actionButtonWidth + (i > 0 ? gapBetweenActions : 0);
        if (nextWidth <= availableForActions) {
          maxActions = i + 1;
          currentWidth = nextWidth;
        } else {
          break;
        }
      }

      return Math.max(0, maxActions);
    };

    const maxVisibleActions = calculateMaxVisibleActions();
    const visibleActions = actions.slice(0, maxVisibleActions);
    const overflowActions = actions.slice(maxVisibleActions);

    const getToolbarColors = () => {
      if (color === "vibrant") {
        return {
          container: theme.colors.primaryContainer,
          buttonContainer: theme.colors.primaryContainer,
          selectedButtonContainer: theme.colors.surfaceContainer,
          icon: theme.colors.onPrimaryContainer,
          selectedIcon: theme.colors.onSurface,
          label: theme.colors.onPrimaryContainer,
          selectedLabel: theme.colors.onSurface,
          ripple: theme.colors.onPrimaryContainer,
          selectedRipple: theme.colors.onSurface,
        };
      }

      return {
        container: theme.colors.surfaceContainer,
        buttonContainer: theme.colors.surfaceContainer,
        selectedButtonContainer: theme.colors.secondaryContainer,
        icon: theme.colors.onSurfaceVariant,
        selectedIcon: theme.colors.onSecondaryContainer,
        label: theme.colors.onSurfaceVariant,
        selectedLabel: theme.colors.onSecondaryContainer,
        ripple: theme.colors.onSurfaceVariant,
        selectedRipple: theme.colors.onSecondaryContainer,
      };
    };

    const toolbarColors = getToolbarColors();

    const elevationStyles = {
      level0: {
        elevation: 0,
        shadowOpacity: 0,
      },
      level1: {
        elevation: 1,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      level3: {
        elevation: 3,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
    };

    const floatingStyles =
      variant === "floating"
        ? {
            borderRadius: 28,
            backgroundColor: toolbarColors.container,
            ...elevationStyles.level3,
          }
        : {};

    const containerStyle: StyleProp<ViewStyle> = [
      {
        height: toolbarDimensions.height,
        backgroundColor: toolbarColors.container,
        paddingHorizontal: toolbarDimensions.paddingHorizontal,
        paddingTop:
          Platform.OS === "android" && variant === "docked"
            ? StatusBar.currentHeight
            : 0,
        justifyContent: "center",
        ...(variant === "docked" && elevationStyles.level1),
      },
      floatingStyles,
    ];

    const actionButtonStyle = {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    };

    const fabStyle = {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      ...elevationStyles.level3,
    };

    const renderNavigationButton = () => {
      if (!navigationIcon) return null;

      return (
        <TouchableRipple
          onPress={onNavigationPress}
          style={actionButtonStyle}
          rippleColor={toolbarColors.ripple}
          borderless
          accessibilityRole="button"
          accessibilityLabel="Navigate back"
        >
          <Icon source={navigationIcon} size={24} color={toolbarColors.icon} />
        </TouchableRipple>
      );
    };

    const renderActions = () => {
      if (actions.length === 0) return null;

      return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 32 }}>
          {visibleActions.map((action, index) => (
            <TouchableRipple
              key={`action-${action.icon}-${index}`}
              onPress={action.onPress}
              style={actionButtonStyle}
              rippleColor={toolbarColors.ripple}
              borderless
              accessibilityRole="button"
              accessibilityLabel={action.accessibilityLabel}
              testID={action.testID}
            >
              <Icon source={action.icon} size={24} color={toolbarColors.icon} />
            </TouchableRipple>
          ))}
          {overflowActions.length > 0 && (
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TouchableRipple
                  onPress={() => setMenuVisible(true)}
                  style={actionButtonStyle}
                  rippleColor={toolbarColors.ripple}
                  borderless
                  accessibilityRole="button"
                  accessibilityLabel="More actions"
                >
                  <Icon
                    source="dots-vertical"
                    size={24}
                    color={toolbarColors.icon}
                  />
                </TouchableRipple>
              }
            >
              {overflowActions.map((action, index) => (
                <Menu.Item
                  key={`overflow-action-${action.icon}-${index}`}
                  onPress={() => {
                    action.onPress();
                    setMenuVisible(false);
                  }}
                  title={action.accessibilityLabel || `Action ${index + 1}`}
                  leadingIcon={action.icon}
                />
              ))}
            </Menu>
          )}
        </View>
      );
    };

    const renderFab = () => {
      if (!fab) return null;

      return (
        <TouchableRipple
          onPress={fab.onPress}
          style={fabStyle}
          rippleColor={theme.colors.onPrimary}
          borderless
          accessibilityRole="button"
          accessibilityLabel={
            fab.accessibilityLabel || "Floating action button"
          }
          testID={fab.testID}
        >
          <Icon source={fab.icon} size={24} color={theme.colors.onPrimary} />
        </TouchableRipple>
      );
    };

    if (variant === "floating" && fab) {
      return (
        <View
          style={{
            position: "absolute",
            bottom: 16,
            left: 0,
            right: 0,
            zIndex: 1000,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <View
            ref={ref}
            style={[
              containerStyle,
              {
                alignSelf: "center",
              },
            ]}
            testID={testID}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="toolbar"
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent:
                  alignment === "center" ? "center" : "flex-start",
                height: "100%",
                gap: 32,
              }}
            >
              {renderNavigationButton()}
              {renderActions()}
            </View>
          </View>
          {/* FAB outside the floating toolbar */}
          {renderFab()}
        </View>
      );
    }

    return (
      <View
        style={[
          variant === "floating" && {
            position: "absolute",
            bottom: 16,
            left: 0,
            right: 0,
            zIndex: 1000,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <View
          ref={ref}
          style={[
            containerStyle,
            variant === "floating" && {
              alignSelf: "center",
            },
          ]}
          testID={testID}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="toolbar"
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
              paddingRight: fab ? 16 : 0,
            }}
          >
            {/* Left side: Navigation and Actions */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                justifyContent:
                  alignment === "center" ? "center" : "flex-start",
                gap: 32,
              }}
            >
              {renderNavigationButton()}
              {renderActions()}
            </View>

            {/* Right side: FAB */}
            {renderFab()}
          </View>
        </View>
      </View>
    );
  },
);

Toolbar.displayName = "Toolbar";
