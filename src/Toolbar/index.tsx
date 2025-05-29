import { type Ref, forwardRef } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Platform, StatusBar, View } from "react-native";
import { Icon, TouchableRipple } from "react-native-paper";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { useTheme } from "../hooks";

/**
 * Defines the visual variant of the Toolbar.
 * - `docked`: A toolbar docked to the edge of the screen, typically the bottom.
 * - `floating`: A toolbar that floats above the content, with rounded corners and elevation.
 */
type Variant = "docked" | "floating";

/**
 * Defines the size of the Toolbar, affecting its height and internal typography.
 * - `small`
 * - `medium`
 * - `large`
 */
type Size = "small" | "medium" | "large";

/**
 * Defines the alignment of the actions within the Toolbar.
 * - `start`: Actions are aligned to the start (left).
 * - `center`: Actions are centered.
 */
type Alignment = "start" | "center";

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
 * @param {Variant} [props.variant="docked"] - The visual variant of the Toolbar.
 * @param {Size} [props.size="small"] - The size of the Toolbar.
 * @param {Alignment} [props.alignment="center"] - The alignment of action items within the Toolbar.
 * @param {IconSource} [props.navigationIcon] - Icon to display for navigation (e.g., back arrow, menu).
 * @param {() => void} [props.onNavigationPress] - Callback function invoked when the navigation icon is pressed.
 * @param {ActionItem[]} [props.actions=[]] - An array of action items to display in the Toolbar (max 3 recommended).
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
  /** Toolbar size */
  size?: Size;
  /** Action alignment */
  alignment?: Alignment;
  /** Navigation icon */
  navigationIcon?: IconSource;
  /** Navigation icon press handler */
  onNavigationPress?: () => void;
  /** Action items (max 3 recommended) */
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

const getToolbarDimensions = (size: Size) => {
  switch (size) {
    case "small":
      return {
        height: 64,
        titleSize: 22,
        titleLineHeight: 28,
        paddingHorizontal: 16,
        fontWeight: "400" as const,
      };
    case "medium":
      return {
        height: 112,
        titleSize: 24,
        titleLineHeight: 32,
        subtitleSize: 14,
        subtitleLineHeight: 20,
        paddingHorizontal: 16,
        fontWeight: "400" as const,
      };
    case "large":
      return {
        height: 152,
        titleSize: 28,
        titleLineHeight: 36,
        subtitleSize: 14,
        subtitleLineHeight: 20,
        paddingHorizontal: 16,
        fontWeight: "400" as const,
      };
    default:
      return {
        height: 64,
        titleSize: 22,
        titleLineHeight: 28,
        paddingHorizontal: 16,
        fontWeight: "400" as const,
      };
  }
};

/**
 * A Toolbar component adhering to Material Design 3 (M3) specifications.
 * It supports `docked` and `floating` variants, different sizes, and can include
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
      variant = "docked",
      size = "small",
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
    const dimensions = getToolbarDimensions(size);

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
            borderRadius: 16,
            marginHorizontal: 16,
            marginVertical: 8,
            backgroundColor: theme.colors.surfaceContainer,
            ...elevationStyles.level3,
          }
        : {};

    const containerStyle: StyleProp<ViewStyle> = [
      {
        height: dimensions.height,
        backgroundColor: theme.colors.surfaceContainer,
        paddingHorizontal: dimensions.paddingHorizontal,
        paddingTop:
          Platform.OS === "android" && variant === "docked"
            ? StatusBar.currentHeight
            : 0,
        justifyContent: size === "large" ? "flex-end" : "center",
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
          rippleColor={theme.colors.primary}
          borderless
          accessibilityRole="button"
          accessibilityLabel="Navigate back"
        >
          <Icon
            source={navigationIcon}
            size={24}
            color={theme.colors.onSurface}
          />
        </TouchableRipple>
      );
    };

    const renderActions = () => {
      if (actions.length === 0) return null;

      return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 32 }}>
          {actions.slice(0, 3).map((action, index) => (
            <TouchableRipple
              key={`action-${action.icon}-${index}`}
              onPress={action.onPress}
              style={actionButtonStyle}
              rippleColor={theme.colors.primary}
              borderless
              accessibilityRole="button"
              accessibilityLabel={action.accessibilityLabel}
              testID={action.testID}
            >
              <Icon
                source={action.icon}
                size={24}
                color={theme.colors.onSurface}
              />
            </TouchableRipple>
          ))}
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
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          <View
            ref={ref}
            style={containerStyle}
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
        ref={ref}
        style={containerStyle}
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
              justifyContent: alignment === "center" ? "center" : "flex-start",
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
    );
  },
);

Toolbar.displayName = "Toolbar";

export default Toolbar;
