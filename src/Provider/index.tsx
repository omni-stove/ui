import type { PropsWithChildren } from "react";
// import { useColorScheme } from "react-native"; // Unused import
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface ThemeProviderProps extends PropsWithChildren {
  keyColor?: string;
}

export const UIProvider = ({
  children,
  keyColor: _keyColor = "#6750A4", // TODO: This prop is not currently used
}: ThemeProviderProps) => {
  // const _colorScheme = useColorScheme(); // Unused variable

  return (
    <SafeAreaProvider>
      <PaperProvider>{children}</PaperProvider>
    </SafeAreaProvider>
  );
};
