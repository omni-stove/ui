import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button } from "react-native-paper";
import { Searchbar } from "../Searchbar";
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

export const WithAppbarContent: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedKey, setSelectedKey] = useState("home");
    
    return (
      <AppLayout
        appbar={{
          content: (
            <View style={{ flex: 1, paddingHorizontal: 8 }}>
              <Searchbar
                placeholder="検索..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ marginVertical: 4 }}
              />
            </View>
          ),
          actions: [
            {
              icon: "filter-variant",
              onPress: () => console.log("Filter pressed"),
              accessibilityLabel: "Filter",
            },
          ],
        }}
        navigationRail={{
          items: sampleNavigationItems.map((item) => ({
            ...item,
            onPress: () => {
              setSelectedKey(item.key);
              item.onPress();
            },
          })),
          selectedItemKey: selectedKey,
          onMenuPress: () => console.log("Menu pressed"),
          fabIcon: "plus",
          fabLabel: "Create",
          onFabPress: () => console.log("FAB pressed"),
          initialStatus: "collapsed",
        }}
        navigationRailBreakpoint={768}
      >
        <SampleContent title={`Search: "${searchQuery}" | Selected: ${selectedKey}`} />
      </AppLayout>
    );
  },
};

export const WithToolbar: Story = {
  args: {
    toolbar: {
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
      fab: {
        icon: "plus",
        onPress: () => console.log("FAB pressed"),
        accessibilityLabel: "Add new item",
      },
    },
    children: <SampleContent title="Layout with Toolbar" />,
  },
};

// Sample NavigationRail items
const sampleNavigationItems = [
  {
    key: "home",
    icon: "home",
    label: "Home",
    onPress: () => console.log("Home pressed"),
  },
  {
    key: "search",
    icon: "magnify",
    label: "Search",
    onPress: () => console.log("Search pressed"),
    badge: { label: "3", size: "small" as const },
  },
  {
    key: "favorites",
    icon: "heart",
    label: "Favorites",
    onPress: () => console.log("Favorites pressed"),
  },
  {
    key: "profile",
    icon: "account",
    label: "Profile",
    onPress: () => console.log("Profile pressed"),
    badge: { label: "New", size: "large" as const },
  },
];

const NavigationRailContent = () => {
  const [selectedKey, setSelectedKey] = useState("home");

  return (
    <AppLayout
      navigationRail={{
        items: sampleNavigationItems.map((item) => ({
          ...item,
          onPress: () => {
            setSelectedKey(item.key);
            item.onPress();
          },
        })),
        selectedItemKey: selectedKey,
        onMenuPress: () => console.log("Menu pressed"),
        fabIcon: "plus",
        fabLabel: "Create",
        onFabPress: () => console.log("FAB pressed"),
        initialStatus: "collapsed",
      }}
      navigationRailBreakpoint={768}
    >
      <SampleContent title={`Selected: ${selectedKey}`} />
    </AppLayout>
  );
};

export const WithNavigationRail: Story = {
  render: () => <NavigationRailContent />,
};

export const WithNavigationRailAndAppbar: Story = {
  render: () => {
    const [selectedKey, setSelectedKey] = useState("home");

    return (
      <AppLayout
        appbar={{
          title: "App with Navigation",
          actions: [
            {
              icon: "dots-vertical",
              onPress: () => console.log("More pressed"),
              accessibilityLabel: "More options",
            },
          ],
        }}
        navigationRail={{
          items: sampleNavigationItems.map((item) => ({
            ...item,
            onPress: () => {
              setSelectedKey(item.key);
              item.onPress();
            },
          })),
          selectedItemKey: selectedKey,
          onMenuPress: () => console.log("Menu pressed"),
          fabIcon: "plus",
          fabLabel: "Create",
          onFabPress: () => console.log("FAB pressed"),
          initialStatus: "expanded",
        }}
        navigationRailBreakpoint={768}
      >
        <SampleContent title={`Selected: ${selectedKey}`} />
      </AppLayout>
    );
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

export const CompleteWithNavigationRail: Story = {
  render: () => {
    const [selectedKey, setSelectedKey] = useState("home");

    return (
      <AppLayout
        appbar={{
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
        }}
        navigationRail={{
          items: sampleNavigationItems.map((item) => ({
            ...item,
            onPress: () => {
              setSelectedKey(item.key);
              item.onPress();
            },
          })),
          selectedItemKey: selectedKey,
          onMenuPress: () => console.log("Menu pressed"),
          fabIcon: "plus",
          fabLabel: "Create",
          onFabPress: () => console.log("FAB pressed"),
          initialStatus: "collapsed",
        }}
        toolbar={{
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
        }}
        navigationRailBreakpoint={768}
      >
        <ScrollableContent />
      </AppLayout>
    );
  },
};
