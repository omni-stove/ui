import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/test";
import { useCallback, useMemo, useRef } from "react"; // Added useMemo and useCallback
import { Button as ReactNativeButton, Text, View } from "react-native"; // Import React Native Button
import { type BottomSheetRef, BottomSheet as Component } from ".";
import { Button as CustomButton } from "../Button"; // Renamed to avoid conflict

const meta: Meta<typeof Component> = {
  component: Component,
  args: {
    // Default args for all stories
    content: (
      <View style={{ padding: 16 }}>
        <Text>This is the content of the bottom sheet!</Text>
        <Text>You can put anything you want here.</Text>
      </View>
    ),
    // children will be defined in each story's render function or args
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

// Removed BottomSheetChildren type as it's no longer needed with the new approach

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
  // Args for this specific story, if different from meta.args
  // args: {
  //   // title: "Default Story Title", // Example of overriding meta args
  // },
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
    // TODO: Add assertion for bottom sheet visibility after it opens
    // For example, check if the title "Awesome BottomSheet" is visible
    // await expect(canvas.findByText("Awesome BottomSheet")).toBeVisible();
    //
    // Need to figure out how to properly wait for the BottomSheetModal to be present
    // and how to query elements within it using testing-library.
  },
};

import GorhomBottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"; // Import Gorhom's BottomSheet
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import GestureHandlerRootView

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
            // enableDynamicSizing={false} // As per example, though not strictly needed for fixed snapPoints
            handleIndicatorStyle={{ backgroundColor: "grey" }} // M3 Handle
            backgroundStyle={{ borderRadius: 28, backgroundColor: "white" }} // M3 Style
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 20,
            }} // M3 Shadow
          >
            <BottomSheetView
              style={{ flex: 1, padding: 24, alignItems: "center" }}
            >
              <Text style={{ fontSize: 18, marginBottom: 10 }}>Awesome 🔥</Text>
              <Text>This is a direct @gorhom/bottom-sheet implementation.</Text>
            </BottomSheetView>
          </GorhomBottomSheet>
        </View>
      </GestureHandlerRootView>
    );
  },
  args: {
    // No args needed from Component as we are using GorhomBottomSheet directly
  },
  name: "Dynamic Snap Points (Direct @gorhom/bottom-sheet)", // Renaming story for clarity
};
