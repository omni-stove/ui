import BottomSheetOriginal, {
  BottomSheetBackdrop,
  type BottomSheetProps,
  type BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  forwardRef,
  type ReactNode,
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

/**
 * Ref methods for controlling the BottomSheet.
 * @param {() => void} open - Opens the bottom sheet. Optionally accepts an index to snap to.
 * @param {() => void} close - Closes the bottom sheet.
 * @param {(index: number) => void} snapToIndex - Snaps the bottom sheet to a specific index.
 * @param {() => void} expand - Expands the bottom sheet to the highest snap point.
 * @param {() => void} collapse - Collapses the bottom sheet to the lowest snap point.
 */
export type BottomSheetRef = {
  open: (index?: number) => void;
  close: () => void;
  snapToIndex: (index: number) => void;
  expand: () => void;
  collapse: () => void;
};

/**
 * Props for the BottomSheet component.
 * @param {ReactNode} [props.children] - Optional trigger element(s) or any other content to render alongside the sheet.
 * @param {ReactNode} props.content - The main content to be displayed inside the bottom sheet.
 * @param {(string | number)[]} [props.snapPoints=["50%", "75%"]] - An array of points to define the height of the bottom sheet when snapped. Defaults to `["50%", "75%"]`.
 * @param {string} [props.title] - An optional title to display at the top of the bottom sheet.
 * @param {number} [props.initialSnapIndex=-1] - The initial snap point index. Defaults to -1 (closed).
 * @param {(index: number) => void} [props.onChange] - Callback function triggered when the snap point changes.
 * @param {BottomSheetProps["backdropComponent"]} [props.backdropComponent] - Custom component for the backdrop. Defaults to `BottomSheetBackdrop`.
 * @param {StyleProp<ViewStyle>} [props.handleIndicatorStyle] - Style for the handle indicator.
 * @param {StyleProp<ViewStyle>} [props.backgroundStyle] - Style for the bottom sheet's background.
 * @param {StyleProp<ViewStyle>} [props.style] - Style for the bottom sheet container.
 */
type Props = {
  children?: ReactNode; // Trigger element(s) or any other content to render alongside the sheet
  content: ReactNode;
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

/**
 * A customizable BottomSheet component based on `@gorhom/bottom-sheet`.
 * It allows rendering custom content, defining snap points, and controlling
 * its state (open, close, snap, expand, collapse) via a ref.
 *
 * The `GestureHandlerRootView` should wrap the entire application or Storybook preview
 * for this component to function correctly. It has been removed from this component
 * to avoid nesting issues.
 *
 * @param {Props} props - The component's props.
 * @param {Ref<BottomSheetRef>} ref - Ref to control the BottomSheet.
 * @returns {JSX.Element} The BottomSheet component.
 * @see {@link https://gorhom.github.io/react-native-bottom-sheet/|@gorhom/bottom-sheet Documentation}
 */
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
