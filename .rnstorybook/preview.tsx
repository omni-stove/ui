import { withBackgrounds } from "@storybook/addon-ondevice-backgrounds";
import type { Preview } from "@storybook/react";
import React from "react";
import { UIProvider } from "../src/Provider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native";

const preview: Preview = {
	decorators: [
		withBackgrounds,
		(Story) => (
			<SafeAreaView style={{ flex: 1 }}>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<UIProvider>
						<Story />
					</UIProvider>
				</GestureHandlerRootView>
			</SafeAreaView>
		),
	],

	parameters: {
		backgrounds: {
			default: "plain",
			values: [
				{ name: "plain", value: "white" },
				{ name: "warm", value: "hotpink" },
				{ name: "cool", value: "deepskyblue" },
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
