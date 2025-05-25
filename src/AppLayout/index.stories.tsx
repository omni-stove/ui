import type { Meta, StoryObj } from "@storybook/react";
import { ScrollView, View } from "react-native";
import { Button } from "react-native-paper";
import { Typography } from "../Typography";
import { AppLayout } from "./index";

const meta: Meta<typeof AppLayout> = {
  title: "Layout/AppLayout",
  component: AppLayout,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    keyboardBehavior: {
      control: { type: "select" },
      options: ["height", "position", "padding"],
    },
    keyboardVerticalOffset: {
      control: { type: "number" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SampleContent = ({ title = "Sample Content" }: { title?: string }) => (
  <View
    style={{
      padding: 16,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Typography variant="titleMedium">{title}</Typography>
    <Button mode="contained" onPress={() => console.log("Button pressed")}>
      Sample Button
    </Button>
  </View>
);

const ScrollableContent = () => (
  <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
    {Array.from({ length: 20 }, (_, i) => {
      const key = `scrollable-item-${i}`;
      return (
        <View
          key={key}
          style={{
            padding: 16,
            marginBottom: 8,
            backgroundColor: "#f0f0f0",
            borderRadius: 8,
          }}
        >
          <Typography>Scrollable Item {i + 1}</Typography>
          <Typography variant="labelSmall" color="onSurfaceVariant">
            This is a sample scrollable content item to demonstrate the layout
            behavior.
          </Typography>
        </View>
      );
    })}
  </ScrollView>
);

export const Default: Story = {
  args: {
    children: <SampleContent title="Basic Layout" />,
  },
};

export const WithAppbar: Story = {
  args: {
    appbar: {
      title: "App Title",
      backAction: {
        onPress: () => console.log("Back pressed"),
        accessibilityLabel: "Go back",
      },
      actions: [
        {
          icon: "magnify",
          onPress: () => console.log("Search pressed"),
          accessibilityLabel: "Search",
        },
        {
          icon: "dots-vertical",
          onPress: () => console.log("More pressed"),
          accessibilityLabel: "More options",
        },
      ],
    },
    children: <SampleContent title="Layout with Appbar" />,
  },
};

export const WithToolbar: Story = {
  args: {
    toolbar: {
      variant: "docked",
      actions: [
        {
          icon: "home",
          onPress: () => console.log("Home pressed"),
          accessibilityLabel: "Home",
        },
        {
          icon: "heart",
          onPress: () => console.log("Favorites pressed"),
          accessibilityLabel: "Favorites",
        },
      ],
    },
    children: <SampleContent title="Layout with Toolbar" />,
  },
};

export const Complete: Story = {
  args: {
    appbar: {
      title: "Complete Layout",
      backAction: {
        onPress: () => console.log("Back pressed"),
        accessibilityLabel: "Go back",
      },
      actions: [
        {
          icon: "magnify",
          onPress: () => console.log("Search pressed"),
          accessibilityLabel: "Search",
        },
      ],
    },
    toolbar: {
      variant: "docked",
      actions: [
        {
          icon: "home",
          onPress: () => console.log("Home pressed"),
          accessibilityLabel: "Home",
        },
        {
          icon: "heart",
          onPress: () => console.log("Favorites pressed"),
          accessibilityLabel: "Favorites",
        },
      ],
    },
    children: <ScrollableContent />,
  },
};
