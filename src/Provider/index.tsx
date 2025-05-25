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

interface ThemeProviderProps extends PropsWithChildren {
  keyColor?: string;
}

// SideSheet Layout Context
const SideSheetLayoutContext = createContext<SideSheetLayoutContextType | null>(
  null,
);

export const useSideSheetLayout = () => {
  const context = useContext(SideSheetLayoutContext);
  if (!context) {
    throw new Error("useSideSheetLayout must be used within UIProvider");
  }
  return context;
};

export const useMainContentStyle = () => {
  const { getMainContentStyle } = useSideSheetLayout();
  return getMainContentStyle();
};

// SideSheet Layout Provider Component
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

  // メインコンテンツのスタイルを自動計算
  const getMainContentStyle = useCallback((): ViewStyle => {
    const openStandardSheets = Array.from(sideSheets.values()).filter(
      (sheet) => sheet.isOpen && sheet.variant === "standard",
    );

    if (openStandardSheets.length === 0) return {};

    // 複数のSideSheetが開いている場合の処理も考慮
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
