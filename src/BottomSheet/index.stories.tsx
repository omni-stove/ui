import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/test";
import { useCallback, useMemo, useRef } from "react";
import { Button as ReactNativeButton, View } from "react-native";
import { type BottomSheetRef, BottomSheet as Component } from ".";
import { Button as CustomButton } from "../Button";
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
          {/* Children are now passed directly and should handle their own press if they are a trigger */}
          <CustomButton onPress={() => ref.current?.open()}>
            Open BottomSheet (Default Story Trigger)
          </CustomButton>
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
          <CustomButton onPress={() => ref.current?.open()}>
            Open BottomSheet (Behavior Story Trigger)
          </CustomButton>
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

import GorhomBottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const DynamicSnapPointsDirect: Story = {
  render: () => {
    const sheetRef = useRef<GorhomBottomSheet>(null);
    const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

    const handleSheetChange = useCallback((index: number) => {
      console.log("handleSheetChange", index);
    }, []);

    const handleSnapPress = useCallback((index: number) => {
      sheetRef.current?.snapToIndex(index);
    }, []);

    const handleClosePress = useCallback(() => {
      sheetRef.current?.close();
    }, []);

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingTop: 50, alignItems: "center" }}>
          <ReactNativeButton
            title="Snap To 90%"
            onPress={() => handleSnapPress(2)}
          />
          <ReactNativeButton
            title="Snap To 50%"
            onPress={() => handleSnapPress(1)}
          />
          <ReactNativeButton
            title="Snap To 25%"
            onPress={() => handleSnapPress(0)}
          />
          <ReactNativeButton title="Close" onPress={handleClosePress} />
          <GorhomBottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            onChange={handleSheetChange}
            handleIndicatorStyle={{ backgroundColor: "grey" }}
            backgroundStyle={{ borderRadius: 28, backgroundColor: "white" }}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 20,
            }}
          >
            <BottomSheetView
              style={{ flex: 1, padding: 24, alignItems: "center" }}
            >
              <Typography variant="titleMedium">Awesome 🔥</Typography>
              <Typography>
                This is a direct @gorhom/bottom-sheet implementation.
              </Typography>
            </BottomSheetView>
          </GorhomBottomSheet>
        </View>
      </GestureHandlerRootView>
    );
  },
  args: {},
  name: "Dynamic Snap Points (Direct @gorhom/bottom-sheet)",
};
