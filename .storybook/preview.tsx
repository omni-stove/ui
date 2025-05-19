import type { Preview } from "@storybook/react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const decorators = [
  (Story) => (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    </GestureHandlerRootView>
  ),
];

const preview: Preview = {
  parameters: {
    // actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  tags: ["autodocs"],
};

export default preview;
