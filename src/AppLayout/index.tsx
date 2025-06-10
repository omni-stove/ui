import {
  type ComponentProps,
  type ReactNode,
  type Ref,
  forwardRef,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Appbar } from "react-native-paper";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationRail, type NavigationRailItem } from "../NavigationRail";
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
 * @param {object} [props.appbar.backAction] - Configuration for the back action in the Appbar.
 * @param {() => void} props.appbar.backAction.onPress - Function to call when the back action is pressed.
 * @param {string} [props.appbar.backAction.accessibilityLabel] - Accessibility label for the back action.
 * @param {AppbarAction[]} [props.appbar.actions] - An array of action items to display in the Appbar.
 * @param {ReactNode} [props.appbar.content] - Additional content to render in the Appbar after the Content component.
 * @param {object} [props.navigationRail] - Configuration for the NavigationRail. If provided, will be displayed responsively (standard on wide web screens, modal otherwise).
 * @param {NavigationRailItem[]} props.navigationRail.items - An array of navigation items to display.
 * @param {string} props.navigationRail.selectedItemKey - The key of the currently selected navigation item.
 * @param {() => void} [props.navigationRail.onMenuPress] - Callback function invoked when the menu button is pressed.
 * @param {IconSource} [props.navigationRail.fabIcon] - Icon for the Floating Action Button within the rail.
 * @param {string} [props.navigationRail.fabLabel] - Label for the FAB (visible when expanded).
 * @param {() => void} [props.navigationRail.onFabPress] - Callback function invoked when the FAB is pressed.
 * @param {"collapsed" | "expanded"} [props.navigationRail.initialStatus] - Initial expanded/collapsed status for standard variant.
 * @param {number} [props.navigationRailBreakpoint=768] - Breakpoint for switching between standard and modal variants (web only).
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
    backAction?: {
      onPress: () => void;
      accessibilityLabel?: string;
    };
    actions?: AppbarAction[];
    content?: ReactNode;
  };
  /** NavigationRail configuration - if provided, will be displayed responsively */
  navigationRail?: {
    items: NavigationRailItem[];
    selectedItemKey: string;
    onMenuPress?: () => void;
    fabIcon?: IconSource;
    fabLabel?: string;
    onFabPress?: () => void;
    initialStatus?: "collapsed" | "expanded";
  };
  /** Breakpoint for switching between standard and modal variants (web only) */
  navigationRailBreakpoint?: number;
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
 * It can include an Appbar at the top, a NavigationRail on the left (responsive),
 * a Toolbar at the bottom, and handles keyboard avoidance and safe area insets.
 * The layout can also automatically adjust for the presence of SideSheets.
 *
 * NavigationRail behavior:
 * - On web platforms with screen width >= breakpoint: displays as standard (persistent) rail
 * - On mobile or web with narrow screens: displays as modal rail
 * - Breakpoint defaults to 768px but can be customized
 *
 * @param {AppLayoutProps} props - The component's props.
 * @param {React.Ref<KeyboardAvoidingView>} ref - Ref for the underlying KeyboardAvoidingView.
 * @returns {JSX.Element} The AppLayout component.
 * @see {@link Toolbar}
 * @see {@link NavigationRail}
 */
export const AppLayout = forwardRef<KeyboardAvoidingView, AppLayoutProps>(
  (
    {
      appbar,
      navigationRail,
      navigationRailBreakpoint = 768,
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

    // Track screen width for responsive NavigationRail variant
    const [screenWidth, setScreenWidth] = useState(
      Platform.OS === "web" ? window.innerWidth : 0,
    );

    useLayoutEffect(() => {
      if (Platform.OS !== "web") return;

      const handleResize = () => {
        setScreenWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Determine NavigationRail variant based on platform and screen width
    const getNavigationRailVariant = () => {
      if (!navigationRail || Platform.OS !== "web") return "modal";
      return screenWidth >= navigationRailBreakpoint ? "standard" : "modal";
    };

    const railVariant = navigationRail ? getNavigationRailVariant() : null;


    const bottomColor = useMemo(() => {
      if (!toolbar) {
        return theme.colors.background;
      }

      if (toolbar.color === "vibrant") {
        return theme.colors.primaryContainer;
      }

      return theme.colors.surfaceContainer;
    }, [toolbar, theme.colors]);

    return (
      <>
        
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
        <KeyboardAvoidingView
          ref={ref}
          style={{ flex: 1 }}
          behavior={keyboardBehavior}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          {/* Appbar */}
          {appbar && (
            <Appbar.Header
              style={{ backgroundColor: theme.colors.surfaceContainer }}
            >
              {appbar.backAction && (
                <Appbar.BackAction
                  onPress={appbar.backAction.onPress}
                  accessibilityLabel={appbar.backAction.accessibilityLabel}
                />
              )}
              {appbar.title ? (
                <Appbar.Content title={appbar.title} />
              ) : appbar.content ? (
                <View style={{ 
                  flexGrow: 1, 
                  flexShrink: 1,
                  marginLeft: 56 // 常にアイコン分の余白を追加
                }}>
                  {appbar.content}
                </View>
              ) : (
                <Appbar.Content title="" />
              )}
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

          {/* Main content with NavigationRail */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            {/* NavigationRail - standard variant */}
            {navigationRail && railVariant === "standard" && (
              <NavigationRail
                variant="standard"
                items={navigationRail.items}
                selectedItemKey={navigationRail.selectedItemKey}
                onMenuPress={navigationRail.onMenuPress}
                fabIcon={navigationRail.fabIcon}
                fabLabel={navigationRail.fabLabel}
                onFabPress={navigationRail.onFabPress}
                initialStatus={navigationRail.initialStatus}
              />
            )}

            {/* Main content */}
            <View style={{ flex: 1 }}>{children}</View>
          </View>

          {/* Toolbar */}
          {toolbar && <Toolbar {...toolbar} />}
        </KeyboardAvoidingView>

        </SafeAreaView>
        
        {/* NavigationRail - modal variant (hidden when BackAction is present) */}
        {navigationRail && railVariant === "modal" && !appbar?.backAction && (
          <NavigationRail
            variant="modal"
            items={navigationRail.items}
            selectedItemKey={navigationRail.selectedItemKey}
            onMenuPress={navigationRail.onMenuPress}
            fabIcon={navigationRail.fabIcon}
            fabLabel={navigationRail.fabLabel}
            onFabPress={navigationRail.onFabPress}
            initialModalOpen={false}
          />
        )}
        
        {/* Bottom safe area for Toolbar - only show for docked variant */}
        {toolbar && toolbar.variant === "docked" && (
          <SafeAreaView
            style={{ backgroundColor: bottomColor }}
            edges={["bottom"]}
          />
        )}
      </>
    );
  },
);

AppLayout.displayName = "AppLayout";
