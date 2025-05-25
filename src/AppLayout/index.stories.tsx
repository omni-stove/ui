import type { Meta, StoryObj } from "@storybook/react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "react-native-paper";
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

// Sample content component
const SampleContent = ({ title = "Sample Content" }: { title?: string }) => (
  <View
    style={{
      padding: 16,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: 18, marginBottom: 16 }}>{title}</Text>
    <Button mode="contained" onPress={() => console.log("Button pressed")}>
      Sample Button
    </Button>
  </View>
);

// Sample scrollable content
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
          <Text>Scrollable Item {i + 1}</Text>
          <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
            This is a sample scrollable content item to demonstrate the layout
            behavior.
          </Text>
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
