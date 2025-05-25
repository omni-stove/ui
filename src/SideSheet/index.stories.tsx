import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentProps, useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SideSheet as Component } from ".";
import { AppLayout } from "../AppLayout";

const meta: Meta<typeof Component> = {
  component: Component,
  parameters: {
    docs: {
      description: {
        component:
          "SideSheet is a surface that slides in from the edge of the screen to display additional content or actions. When used with AppLayout, it automatically adjusts the main content width using Context API.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

const SideSheetWithAppLayout = (args: ComponentProps<typeof Component>) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* AppLayoutが自動的にSideSheetの幅調整を行う */}
      <AppLayout
        appbar={{
          title: "SideSheet Demo",
          subtitle: "With AppLayout integration",
        }}
      >
        <View style={{ flex: 1, padding: 16 }}>
          <Text variant="headlineSmall" style={{ marginBottom: 16 }}>
            Main Content Area
          </Text>
          <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
            This content is automatically adjusted when SideSheet opens.
            AppLayout handles the layout changes seamlessly using Context API.
          </Text>
          <Button mode="contained" onPress={() => setIsOpen(true)}>
            Open SideSheet
          </Button>
          <Text variant="bodySmall" style={{ marginTop: 16, color: "#666" }}>
            Notice how the entire app layout adjusts when the SideSheet opens,
            including the AppBar and content area.
          </Text>
        </View>
      </AppLayout>

      {/* SideSheet - childrenはトリガーとしてのみ使用 */}
      <Component {...args} isOpen={isOpen} onOpenChange={setIsOpen}>
        <View />
      </Component>
    </>
  );
};

const args: Story["args"] = {
  headline: "SideSheet Title",
  content: (
    <View>
      <Text variant="bodyLarge" style={{ marginBottom: 16 }}>
        This is the main content of the side sheet. You can put any React Native
        components here.
      </Text>
      <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
        The side sheet slides in from the right side of the screen and provides
        additional space for content and actions.
      </Text>
      <Text variant="bodySmall" style={{ color: "#666" }}>
        When used with AppLayout, the entire app layout automatically adjusts to
        accommodate the SideSheet width.
      </Text>
    </View>
  ),
  actions: [
    {
      label: "Cancel",
      variant: "outlined" as const,
      onClick: () => console.log("Cancel clicked"),
    },
    {
      label: "Save",
      variant: "filled" as const,
      onClick: () => console.log("Save clicked"),
    },
  ],
};

export const WithAppLayout: Story = {
  args,
  render: (args) => <SideSheetWithAppLayout {...args} />,
};

export const ModalVariant: Story = {
  args: {
    ...args,
    variant: "modal",
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <AppLayout
          appbar={{
            title: "Modal SideSheet",
            subtitle: "Overlay mode",
          }}
        >
          <View style={{ flex: 1, padding: 16 }}>
            <Text variant="headlineSmall" style={{ marginBottom: 16 }}>
              Modal Variant Demo
            </Text>
            <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
              In modal variant, the SideSheet appears as an overlay without
              affecting the main content layout.
            </Text>
            <Button mode="contained" onPress={() => setIsOpen(true)}>
              Open Modal SideSheet
            </Button>
          </View>
        </AppLayout>

        <Component {...args} isOpen={isOpen} onOpenChange={setIsOpen}>
          <View />
        </Component>
      </>
    );
  },
};

export const LeftPosition: Story = {
  args: {
    ...args,
    position: "left",
  },
  render: (args) => <SideSheetWithAppLayout {...args} />,
};

export const WithoutDivider: Story = {
  args: {
    ...args,
    hasDivider: false,
  },
  render: (args) => <SideSheetWithAppLayout {...args} />,
};
