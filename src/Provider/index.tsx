import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import type { PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface ThemeProviderProps extends PropsWithChildren {
  keyColor?: string;
}

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
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </SafeAreaProvider>
  );
};
