import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentProps, useState } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { SideSheet as Component } from ".";
import { AppLayout } from "../AppLayout";
import { Typography } from "../Typography";

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
          <Typography variant="headlineSmall">Main Content Area</Typography>
          <Typography variant="bodyMedium">
            This content is automatically adjusted when SideSheet opens.
            AppLayout handles the layout changes seamlessly using Context API.
          </Typography>
          <Button mode="contained" onPress={() => setIsOpen(true)}>
            Open SideSheet
          </Button>
          <Typography variant="bodySmall" color="onSurfaceVariant">
            Notice how the entire app layout adjusts when the SideSheet opens,
            including the AppBar and content area.
          </Typography>
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
      <Typography variant="bodyLarge">
        This is the main content of the side sheet. You can put any React Native
        components here.
      </Typography>
      <Typography variant="bodyMedium">
        The side sheet slides in from the right side of the screen and provides
        additional space for content and actions.
      </Typography>
      <Typography variant="bodySmall" color="onSurfaceVariant">
        When used with AppLayout, the entire app layout automatically adjusts to
        accommodate the SideSheet width.
      </Typography>
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
            <Typography variant="headlineSmall">Modal Variant Demo</Typography>
            <Typography variant="bodyMedium">
              In modal variant, the SideSheet appears as an overlay without
              affecting the main content layout.
            </Typography>
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
