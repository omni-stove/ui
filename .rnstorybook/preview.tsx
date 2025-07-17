import { withBackgrounds } from "@storybook/addon-ondevice-backgrounds";
import type { Preview } from "@storybook/react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { UIProvider } from "../src/Provider";
import "../src/theme.css"; // Import theme.css
import "../src/global.css"; // Add this line to import global styles

const ThemeAwareDecorator = (Story: any, context: any) => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<UIProvider>
				<Story />
			</UIProvider>
		</GestureHandlerRootView>
	);
};

const preview: Preview = {
	decorators: [withBackgrounds, ThemeAwareDecorator],

	parameters: {
		backgrounds: {
			default: "auto",
			values: [
				{ name: "auto", value: "transparent" }, // システムテーマに従う
				{ name: "light", value: MD3LightTheme.colors.background },
				{ name: "dark", value: MD3DarkTheme.colors.background },
				{ name: "surface", value: MD3LightTheme.colors.surface },
			],
		},
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},
};

export default preview;
