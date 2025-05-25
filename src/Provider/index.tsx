import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import type { PropsWithChildren, ReactNode } from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { type ViewStyle, useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type {
  SideSheetLayoutContextType,
  SideSheetLayoutState,
} from "../hooks/types";

/**
 * Props for the UIProvider component.
 * @param {object} props - The component's props.
 * @param {string} [props.keyColor] - Optional key color for the theme.
 * @param {ReactNode} props.children - The child components to be rendered within the provider.
 */
interface ThemeProviderProps extends PropsWithChildren {
  keyColor?: string;
}

/**
 * Context for managing the layout of SideSheets.
 * This context provides functions to register, unregister, and update SideSheets,
 * as well as a function to get the style for the main content area,
 * adjusting for any open standard SideSheets.
 */
const SideSheetLayoutContext = createContext<SideSheetLayoutContextType | null>(
  null,
);

/**
 * Hook to access the SideSheetLayoutContext.
 * Throws an error if used outside of a UIProvider.
 *
 * @returns {SideSheetLayoutContextType} The SideSheet layout context.
 * @throws {Error} If used outside of UIProvider.
 */
export const useSideSheetLayout = () => {
  const context = useContext(SideSheetLayoutContext);
  if (!context) {
    throw new Error("useSideSheetLayout must be used within UIProvider");
  }
  return context;
};

/**
 * Hook to get the style for the main content area.
 * This style adjusts dynamically based on the presence and width of open standard SideSheets.
 *
 * @returns {ViewStyle} The style object for the main content.
 */
export const useMainContentStyle = () => {
  const { getMainContentStyle } = useSideSheetLayout();
  return getMainContentStyle();
};

/**
 * Provider component for SideSheet layout management.
 * Manages the state of registered SideSheets and provides context values
 * to its children.
 *
 * @param {object} props - The component's props.
 * @param {ReactNode} props.children - The child components.
 * @returns {JSX.Element} The SideSheetLayoutProvider component.
 */
const SideSheetLayoutProvider = ({ children }: { children: ReactNode }) => {
  const [sideSheets, setSideSheets] = useState<
    Map<string, SideSheetLayoutState>
  >(new Map());

  const registerSideSheet = useCallback(
    (id: string, state: SideSheetLayoutState) => {
      setSideSheets((prev) => new Map(prev).set(id, state));
    },
    [],
  );

  const unregisterSideSheet = useCallback((id: string) => {
    setSideSheets((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const updateSideSheet = useCallback(
    (id: string, state: Partial<SideSheetLayoutState>) => {
      setSideSheets((prev) => {
        const newMap = new Map(prev);
        const current = newMap.get(id);
        if (current) {
          newMap.set(id, { ...current, ...state });
        }
        return newMap;
      });
    },
    [],
  );

  const getMainContentStyle = useCallback((): ViewStyle => {
    const openStandardSheets = Array.from(sideSheets.values()).filter(
      (sheet) => sheet.isOpen && sheet.variant === "standard",
    );

    if (openStandardSheets.length === 0) return {};

    const rightSheets = openStandardSheets.filter(
      (s) => s.position === "right",
    );
    const leftSheets = openStandardSheets.filter((s) => s.position === "left");

    const rightWidth = rightSheets.reduce((sum, sheet) => sum + sheet.width, 0);
    const leftWidth = leftSheets.reduce((sum, sheet) => sum + sheet.width, 0);

    return {
      marginRight: rightWidth,
      marginLeft: leftWidth,
    };
  }, [sideSheets]);

  return (
    <SideSheetLayoutContext.Provider
      value={{
        sideSheets,
        registerSideSheet,
        unregisterSideSheet,
        updateSideSheet,
        getMainContentStyle,
      }}
    >
      {children}
    </SideSheetLayoutContext.Provider>
  );
};

/**
 * UIProvider component that sets up the application's theme and layout context.
 * It integrates Material 3 theming with React Native Paper and provides
 * SideSheet layout management.
 *
 * @param {ThemeProviderProps} props - The component's props.
 * @param {ReactNode} props.children - The child components to be rendered within the provider.
 * @param {string} [props.keyColor="#6750A4"] - The primary color used to generate the Material 3 theme. Defaults to "#6750A4".
 * @returns {JSX.Element} The UIProvider component.
 */
export const UIProvider = ({
  children,
  keyColor = "#6750A4",
}: ThemeProviderProps) => {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ sourceColor: keyColor });

  const material3Theme = colorScheme === "dark" ? theme.dark : theme.light;

  const paperTheme = {
    ...(colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme),
    colors: {
      ...(colorScheme === "dark" ? MD3DarkTheme.colors : MD3LightTheme.colors),
      ...material3Theme,
    },
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <SideSheetLayoutProvider>{children}</SideSheetLayoutProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};
