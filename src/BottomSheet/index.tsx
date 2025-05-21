import BottomSheetOriginal, {
  BottomSheetBackdrop,
  type BottomSheetProps,
  type BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type React from "react";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
// import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Removed from here

export type BottomSheetRef = {
  open: (index?: number) => void;
  close: () => void;
  snapToIndex: (index: number) => void;
  expand: () => void;
  collapse: () => void;
};

type Props = {
  children?: React.ReactNode; // Trigger element(s) or any other content to render alongside the sheet
  content: React.ReactNode;
  snapPoints?: (string | number)[];
  title?: string;
  initialSnapIndex?: number; // To control initial state (e.g., -1 for closed)
  onChange?: (index: number) => void;
  backdropComponent?: BottomSheetProps["backdropComponent"];
  handleIndicatorStyle?: StyleProp<ViewStyle>;
  backgroundStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  // Add any other props from @gorhom/bottom-sheet that we want to expose
};

export const BottomSheet = forwardRef<BottomSheetRef, Props>(
  (
    {
      children, // Children are now rendered directly, not cloned.
      content,
      snapPoints: _snapPoints,
      title,
      initialSnapIndex = -1, // Default to closed
      onChange,
      backdropComponent,
      handleIndicatorStyle,
      backgroundStyle,
      style,
      ...rest // Pass through other BottomSheet props
    },
    ref,
  ) => {
    const bottomSheetRef = useRef<BottomSheetOriginal>(null);

    const snapPoints = useMemo(
      () => _snapPoints || ["50%", "75%"],
      [_snapPoints],
    );

    // Public methods exposed via ref
    const openSheet = useCallback((index = 0) => {
      bottomSheetRef.current?.snapToIndex(index);
    }, []);

    const closeSheet = useCallback(() => {
      bottomSheetRef.current?.close();
    }, []);

    const snapSheetTo = useCallback((index: number) => {
      bottomSheetRef.current?.snapToIndex(index);
    }, []);

    const expandSheet = useCallback(() => {
      bottomSheetRef.current?.expand();
    }, []);

    const collapseSheet = useCallback(() => {
      bottomSheetRef.current?.collapse();
    }, []);

    useImperativeHandle(ref, () => ({
      open: openSheet,
      close: closeSheet,
      snapToIndex: snapSheetTo,
      expand: expandSheet,
      collapse: collapseSheet,
    }));

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior={"close"} // Added pressBehavior to close on backdrop press
        />
      ),
      [],
    );

    const BottomSheetTitle = ({ text }: { text: string }) => (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{text}</Text>
      </View>
    );

    return (
      // GestureHandlerRootView should ideally wrap the entire app or storybook preview.
      // It's removed from this component to avoid nesting issues.
      // The parent application or Storybook's preview.js/tsx should provide it.
      <>
        {children /* Render children directly */}
        <BottomSheetOriginal
          ref={bottomSheetRef}
          index={initialSnapIndex}
          snapPoints={snapPoints}
          onChange={onChange}
          backdropComponent={backdropComponent || renderBackdrop}
          handleIndicatorStyle={[
            styles.defaultHandleIndicator,
            handleIndicatorStyle,
          ]}
          backgroundStyle={[styles.defaultBackground, backgroundStyle]}
          style={[styles.defaultSheet, style]}
          enablePanDownToClose={true} // Explicitly set to ensure pan down to close is enabled
          {...rest}
        >
          {title && <BottomSheetTitle text={title} />}
          <BottomSheetView style={styles.contentContainer}>
            {content}
          </BottomSheetView>
        </BottomSheetOriginal>
      </>
    );
  },
);

const styles = StyleSheet.create({
  // root style removed as GestureHandlerRootView is removed
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8, // Adjusted padding
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  titleText: {
    fontSize: 18, // M3 Title Large is ~22, Medium ~16. Let's go with 18.
    fontWeight: "500", // Medium weight
  },
  contentContainer: {
    flex: 1, // Ensure content can take up space
    padding: 16,
  },
  defaultHandleIndicator: {
    backgroundColor: "grey", // From story
    width: 32,
    height: 4,
    borderRadius: 2,
  },
  defaultBackground: {
    backgroundColor: "white", // From story
    borderTopLeftRadius: 28, // M3 Top corners
    borderTopRightRadius: 28,
  },
  defaultSheet: {
    // For shadow, from story
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 }, // Shadow upwards
    shadowOpacity: 0.1,
    shadowRadius: 5, // Softer shadow
    elevation: 20, // For Android
  },
});

BottomSheet.displayName = "BottomSheet";
