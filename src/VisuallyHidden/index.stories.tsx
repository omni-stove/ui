import type { Meta, StoryObj } from "@storybook/react";
import { View, Text } from "react-native"; // Reactのimportを削除し、Viewを追加
import { VisuallyHidden } from "./index"; // プロジェクトに合わせてパスを調整

const meta = {
  title: "VisuallyHidden",
  component: VisuallyHidden,
  args: {
    children: (
      <Text>
        This text is visually hidden and also hidden from screen readers.
      </Text>
    ),
  },
  decorators: [
    (Story) => (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Text>
          The VisuallyHidden component is active below (it will be hidden
          visually and from accessibility tools).
        </Text>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof VisuallyHidden>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
