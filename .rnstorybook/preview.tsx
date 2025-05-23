import { withBackgrounds } from "@storybook/addon-ondevice-backgrounds";
import type { Preview } from "@storybook/react";
import React from "react";
import { UIProvider } from "../src/Provider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView, ScrollView, useColorScheme } from "react-native";
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

const ThemeAwareDecorator = (Story: any, context: any) => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
	
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<UIProvider>
					<ScrollView style={{ flex: 1 }}>
						<Story />
					</ScrollView>
				</UIProvider>
			</GestureHandlerRootView>
		</SafeAreaView>
	);
};

const preview: Preview = {
	decorators: [
		withBackgrounds,
		ThemeAwareDecorator,
	],

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
