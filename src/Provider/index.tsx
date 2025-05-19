import type { PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface ThemeProviderProps extends PropsWithChildren {
  keyColor?: string;
}

export const UIProvider = ({
  children,
  keyColor = "#6750A4",
}: ThemeProviderProps) => {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <PaperProvider>{children}</PaperProvider>
    </SafeAreaProvider>
  );
};
