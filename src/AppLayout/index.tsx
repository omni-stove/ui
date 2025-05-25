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

type AppbarAction = {
  icon: IconSource;
  onPress: () => void;
  accessibilityLabel?: string;
  testID?: string;
};

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
