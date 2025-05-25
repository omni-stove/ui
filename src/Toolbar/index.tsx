import { type Ref, forwardRef } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Platform, StatusBar, View } from "react-native";
import { Icon, TouchableRipple } from "react-native-paper";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { useTheme } from "../hooks";

// M3 Toolbar variants and sizes
type Variant = "docked" | "floating";
type Size = "small" | "medium" | "large";
type Alignment = "start" | "center";

type ActionItem = {
  icon: IconSource;
  onPress: () => void;
  accessibilityLabel?: string;
  testID?: string;
};

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

// M3 Toolbar size specifications (updated to match M3 guidelines)
const getToolbarDimensions = (size: Size) => {
  switch (size) {
    case "small":
      return {
        height: 64,
        titleSize: 22, // M3 Title Large
        titleLineHeight: 28,
        paddingHorizontal: 16,
        fontWeight: "400" as const,
      };
    case "medium":
      return {
        height: 112,
        titleSize: 24, // M3 Headline Small
        titleLineHeight: 32,
        subtitleSize: 14, // M3 Body Medium
        subtitleLineHeight: 20,
        paddingHorizontal: 16,
        fontWeight: "400" as const,
      };
    case "large":
      return {
        height: 152,
        titleSize: 28, // M3 Headline Medium
        titleLineHeight: 36,
        subtitleSize: 14, // M3 Body Medium
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

    // M3 color tokens
    const colors = {
      surface: theme.colors.surface,
      surfaceContainer: theme.colors.surfaceVariant, // M3 uses surface-container for floating
      onSurface: theme.colors.onSurface,
      onSurfaceVariant: theme.colors.onSurfaceVariant,
      primary: theme.colors.primary,
      onPrimary: theme.colors.onPrimary,
      shadow: theme.colors.shadow,
    };

    // M3 Elevation tokens
    const elevationStyles = {
      level0: {
        elevation: 0,
        shadowOpacity: 0,
      },
      level1: {
        elevation: 1,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      level3: {
        elevation: 3,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
    };

    // Floating variant specific styles
    const floatingStyles =
      variant === "floating"
        ? {
            borderRadius: 16,
            marginHorizontal: 16,
            marginVertical: 8,
            backgroundColor: colors.surfaceContainer,
            ...elevationStyles.level3,
          }
        : {};

    // Container style
    const containerStyle: StyleProp<ViewStyle> = [
      {
        height: dimensions.height,
        backgroundColor: colors.surfaceContainer, // M3 Toolbar uses surface-container for both variants
        paddingHorizontal: dimensions.paddingHorizontal,
        paddingTop:
          Platform.OS === "android" && variant === "docked"
            ? StatusBar.currentHeight
            : 0,
        justifyContent: size === "large" ? "flex-end" : "center",
        // Docked variant gets subtle elevation
        ...(variant === "docked" && elevationStyles.level1),
      },
      floatingStyles,
    ];

    // Action button style - M3 spec: 48dp touch target
    const actionButtonStyle = {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    };

    // FAB style - M3 spec: 56dp for standard FAB
    const fabStyle = {
      width: 56,
      height: 56,
      borderRadius: 16, // M3 FAB uses 16dp corner radius
      backgroundColor: colors.primary,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      ...elevationStyles.level3, // FAB has elevation level 3
    };

    // Navigation button
    const renderNavigationButton = () => {
      if (!navigationIcon) return null;

      return (
        <TouchableRipple
          onPress={onNavigationPress}
          style={actionButtonStyle}
          rippleColor={colors.primary}
          borderless
          accessibilityRole="button"
          accessibilityLabel="Navigate back"
        >
          <Icon source={navigationIcon} size={24} color={colors.onSurface} />
        </TouchableRipple>
      );
    };

    // Action buttons
    const renderActions = () => {
      if (actions.length === 0) return null;

      return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 32 }}>
          {actions.slice(0, 3).map((action, index) => (
            <TouchableRipple
              key={`action-${action.icon}-${index}`}
              onPress={action.onPress}
              style={actionButtonStyle}
              rippleColor={colors.primary}
              borderless
              accessibilityRole="button"
              accessibilityLabel={action.accessibilityLabel}
              testID={action.testID}
            >
              <Icon source={action.icon} size={24} color={colors.onSurface} />
            </TouchableRipple>
          ))}
        </View>
      );
    };

    // FAB button - M3 spec: positioned on the right side
    const renderFab = () => {
      if (!fab) return null;

      return (
        <TouchableRipple
          onPress={fab.onPress}
          style={fabStyle}
          rippleColor={colors.onPrimary}
          borderless
          accessibilityRole="button"
          accessibilityLabel={
            fab.accessibilityLabel || "Floating action button"
          }
          testID={fab.testID}
        >
          <Icon source={fab.icon} size={24} color={colors.onPrimary} />
        </TouchableRipple>
      );
    };

    // For floating variant, FAB should be positioned outside the toolbar
    if (variant === "floating" && fab) {
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16, // Gap between toolbar and FAB
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
                gap: 32, // M3 spec: 32dp spacing between navigation and actions
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

    // For docked variant, FAB is inside the toolbar
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
            paddingRight: fab ? 16 : 0, // Add padding when FAB is present
          }}
        >
          {/* Left side: Navigation and Actions */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              justifyContent: alignment === "center" ? "center" : "flex-start",
              gap: 32, // M3 spec: 32dp spacing between navigation and actions
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
