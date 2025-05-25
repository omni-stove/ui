import {
  type ComponentProps,
  type ReactNode,
  type Ref,
  forwardRef,
} from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Appbar } from "react-native-paper";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMainContentStyle } from "../Provider";
import { Toolbar } from "../Toolbar";
import { useTheme } from "../hooks";

/**
 * Represents an action item for the Appbar.
 * @param {IconSource} icon - The icon to display for the action.
 * @param {() => void} onPress - Function to call when the action is pressed.
 * @param {string} [accessibilityLabel] - Accessibility label for the action.
 * @param {string} [testID] - Test ID for the action.
 */
type AppbarAction = {
  icon: IconSource;
  onPress: () => void;
  accessibilityLabel?: string;
  testID?: string;
};

/**
 * Props for the AppLayout component.
 * @param {object} [props.appbar] - Configuration for the Appbar. If provided, an Appbar will be displayed at the top.
 * @param {string} [props.appbar.title] - The title to display in the Appbar.
 * @param {string} [props.appbar.subtitle] - The subtitle to display in the Appbar.
 * @param {object} [props.appbar.backAction] - Configuration for the back action in the Appbar.
 * @param {() => void} props.appbar.backAction.onPress - Function to call when the back action is pressed.
 * @param {string} [props.appbar.backAction.accessibilityLabel] - Accessibility label for the back action.
 * @param {AppbarAction[]} [props.appbar.actions] - An array of action items to display in the Appbar.
 * @param {ComponentProps<typeof Toolbar>} [props.toolbar] - Props for the Toolbar component. If provided, a Toolbar will be displayed at the bottom.
 * @param {ReactNode} props.children - The main content to be rendered within the layout.
 * @param {"height" | "position" | "padding"} [props.keyboardBehavior] - Defines how the layout behaves when the keyboard is visible. Defaults to "padding" on iOS and "height" on other platforms.
 * @param {number} [props.keyboardVerticalOffset] - The offset for the keyboard. Defaults to 0 on iOS and 25 on other platforms.
 * @param {string} [props.testID] - Test ID for the AppLayout component.
 * @param {string} [props.accessibilityLabel] - Accessibility label for the AppLayout component.
 * @param {boolean} [props.autoAdjustForSideSheet=true] - Whether to automatically adjust the layout when a SideSheet is present. Defaults to true.
 */
type AppLayoutProps = {
  /** Appbar configuration - if provided, will be displayed at the top */
  appbar?: {
    title?: string;
    subtitle?: string;
    backAction?: {
      onPress: () => void;
      accessibilityLabel?: string;
    };
    actions?: AppbarAction[];
  };
  /** Toolbar component - if provided, will be displayed at the bottom */
  toolbar?: ComponentProps<typeof Toolbar>;
  /** Main content */
  children: ReactNode;
  /** Keyboard avoiding behavior */
  keyboardBehavior?: "height" | "position" | "padding";
  /** Keyboard vertical offset */
  keyboardVerticalOffset?: number;
  /** Test ID */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Whether to automatically adjust layout for SideSheet. @default true */
  autoAdjustForSideSheet?: boolean;
};

/**
 * AppLayout provides a consistent layout structure for application screens.
 * It can include an Appbar at the top, a Toolbar at the bottom, and handles
 * keyboard avoidance and safe area insets.
 * The layout can also automatically adjust for the presence of SideSheets.
 *
 * @param {AppLayoutProps} props - The component's props.
 * @param {Ref<KeyboardAvoidingView>} ref - Ref for the underlying KeyboardAvoidingView.
 * @returns {JSX.Element} The AppLayout component.
 * @see {@link Toolbar}
 */
export const AppLayout = forwardRef<KeyboardAvoidingView, AppLayoutProps>(
  (
    {
      appbar,
      toolbar,
      children,
      keyboardBehavior = Platform.OS === "ios" ? "padding" : "height",
      keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 25,
      testID,
      accessibilityLabel,
      autoAdjustForSideSheet = true,
    },
    ref: Ref<KeyboardAvoidingView>,
  ) => {
    const theme = useTheme();
    const mainContentStyle = autoAdjustForSideSheet
      ? useMainContentStyle()
      : {};

    // AppBar uses surface color, Toolbar uses surfaceVariant
    const topColor = appbar ? theme.colors.surface : theme.colors.background;
    const bottomColor = toolbar
      ? theme.colors.surfaceVariant
      : theme.colors.background;

    return (
      <SafeAreaView
        style={[
          {
            flex: 1,
            backgroundColor: theme.colors.background,
          },
          mainContentStyle,
        ]}
        edges={
          appbar || toolbar
            ? ["left", "right"]
            : ["top", "left", "right", "bottom"]
        }
        testID={testID}
        accessibilityLabel={accessibilityLabel}
      >
        {/* Top safe area for AppBar */}
        {appbar && (
          <SafeAreaView style={{ backgroundColor: topColor }} edges={["top"]} />
        )}
        <KeyboardAvoidingView
          ref={ref}
          style={{ flex: 1 }}
          behavior={keyboardBehavior}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          {/* Appbar */}
          {appbar && (
            <Appbar.Header>
              {appbar.backAction && (
                <Appbar.BackAction
                  onPress={appbar.backAction.onPress}
                  accessibilityLabel={appbar.backAction.accessibilityLabel}
                />
              )}
              <Appbar.Content title={appbar.title} subtitle={appbar.subtitle} />
              {appbar.actions?.map((action, index) => (
                <Appbar.Action
                  key={`appbar-action-${action.icon}-${index}`}
                  icon={action.icon}
                  onPress={action.onPress}
                  accessibilityLabel={action.accessibilityLabel}
                  testID={action.testID}
                />
              ))}
            </Appbar.Header>
          )}

          {/* Main content */}
          <View style={{ flex: 1 }}>{children}</View>

          {/* Toolbar */}
          {toolbar && <Toolbar {...toolbar} />}
        </KeyboardAvoidingView>

        {/* Bottom safe area for Toolbar */}
        {toolbar && (
          <SafeAreaView
            style={{ backgroundColor: bottomColor }}
            edges={["bottom"]}
          />
        )}
      </SafeAreaView>
    );
  },
);

AppLayout.displayName = "AppLayout";
