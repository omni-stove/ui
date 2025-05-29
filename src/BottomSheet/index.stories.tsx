import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/test";
import { useRef } from "react";
import { View } from "react-native";
import { type BottomSheetRef, BottomSheet as Component } from ".";
import { Button } from "../Button";
import { Typography } from "../Typography";

const meta: Meta<typeof Component> = {
  component: Component,
  args: {
    content: (
      <View style={{ padding: 16 }}>
        <Typography>This is the content of the bottom sheet!</Typography>
        <Typography>You can put anything you want here.</Typography>
      </View>
    ),
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Default: Story = {
  render: (args) => {
    const ref = useRef<BottomSheetRef>(null);
    return (
      <View style={{ alignItems: "center", paddingTop: 20 }}>
        <Component {...args} ref={ref}>
          <Button onPress={() => ref.current?.open()}>Open BottomSheet</Button>
        </Component>
      </View>
    );
  },
};

export const WithTitle: Story = {
  render: (args) => {
    const ref = useRef<BottomSheetRef>(null);
    return (
      <View style={{ alignItems: "center", paddingTop: 20 }}>
        <Component {...args} ref={ref} title="選択してください">
          <Button onPress={() => ref.current?.open()}>
            Open BottomSheet with Title
          </Button>
        </Component>
      </View>
    );
  },
};

export const Behavior: Story = {
  render: (args) => {
    const ref = useRef<BottomSheetRef>(null);
    return (
      <View style={{ alignItems: "center", paddingTop: 20 }}>
        <Component {...args} ref={ref}>
          <Button onPress={() => ref.current?.open()}>
            Open BottomSheet (Behavior Test)
          </Button>
        </Component>
      </View>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByRole("button", {
      name: /Open BottomSheet/i,
    });
    await userEvent.click(button);
  },
};

export const LongContent: Story = {
  render: (args) => {
    const ref = useRef<BottomSheetRef>(null);
    const longContent = (
      <View style={{ padding: 16 }}>
        <Typography variant="titleMedium" style={{ marginBottom: 16 }}>
          長いコンテンツのテスト
        </Typography>
        {Array.from({ length: 20 }, (_, i) => {
          const itemId = `long-content-test-item-${i + 1}`;
          return (
            <Typography key={itemId} style={{ marginBottom: 8 }}>
              これは長いコンテンツのテスト項目 {i + 1}{" "}
              です。BottomSheetがスクロール可能かどうかを確認するためのテキストです。
            </Typography>
          );
        })}
      </View>
    );

    return (
      <View style={{ alignItems: "center", paddingTop: 20 }}>
        <Component
          {...args}
          ref={ref}
          content={longContent}
          title="長いコンテンツ"
        >
          <Button onPress={() => ref.current?.open()}>
            Open Long Content BottomSheet
          </Button>
        </Component>
      </View>
    );
  },
};

export const StandardVariant: Story = {
  render: (args) => {
    const ref = useRef<BottomSheetRef>(null);
    return (
      <View style={{ alignItems: "center", paddingTop: 20, gap: 16 }}>
        <Typography variant="titleMedium">
          Standard Variant - 背景操作可能
        </Typography>
        <Button onPress={() => console.log("背景ボタンがタップされました")}>
          背景のボタン（タップ可能）
        </Button>
        <Component
          {...args}
          ref={ref}
          variant="standard"
          title="Standard BottomSheet"
        >
          <Button onPress={() => ref.current?.open()}>
            Open Standard BottomSheet
          </Button>
        </Component>
      </View>
    );
  },
};

export const ModalVariant: Story = {
  render: (args) => {
    const ref = useRef<BottomSheetRef>(null);
    return (
      <View style={{ alignItems: "center", paddingTop: 20, gap: 16 }}>
        <Typography variant="titleMedium">
          Modal Variant - 背景操作不可
        </Typography>
        <Button onPress={() => console.log("背景ボタンがタップされました")}>
          背景のボタン（タップ不可になる）
        </Button>
        <Component
          {...args}
          ref={ref}
          variant="modal"
          title="Modal BottomSheet"
        >
          <Button onPress={() => ref.current?.open()}>
            Open Modal BottomSheet
          </Button>
        </Component>
      </View>
    );
  },
};

export const VariantComparison: Story = {
  render: (args) => {
    const standardRef = useRef<BottomSheetRef>(null);
    const modalRef = useRef<BottomSheetRef>(null);

    return (
      <View style={{ alignItems: "center", paddingTop: 20, gap: 16 }}>
        <Typography variant="titleMedium">Variant比較テスト</Typography>
        <Button onPress={() => console.log("背景ボタンがタップされました")}>
          背景のボタン
        </Button>

        <View style={{ flexDirection: "row", gap: 16 }}>
          <Component
            {...args}
            ref={standardRef}
            variant="standard"
            title="Standard"
          >
            <Button onPress={() => standardRef.current?.open()}>
              Standard
            </Button>
          </Component>

          <Component {...args} ref={modalRef} variant="modal" title="Modal">
            <Button onPress={() => modalRef.current?.open()}>Modal</Button>
          </Component>
        </View>

        <Typography
          variant="bodySmall"
          style={{ textAlign: "center", marginTop: 16 }}
        >
          Standardは背景操作可能、Modalは背景操作不可
        </Typography>
      </View>
    );
  },
};
