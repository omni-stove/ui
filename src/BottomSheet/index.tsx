import BottomSheetOriginal, {
  BottomSheetBackdrop,
  type BottomSheetProps,
  type BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  type ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { Divider } from "../Divider";
import { Portal } from "../Portal";
import { Typography } from "../Typography";

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
 * @param {"standard" | "modal"} [props.variant="standard"] - The variant of the bottom sheet. "standard" allows background interaction, "modal" blocks background interaction.
 */
type Props = {
  children?: ReactNode;
  content: ReactNode;
  snapPoints?: (string | number)[];
  title?: string;
  initialSnapIndex?: number;
  onChange?: (index: number) => void;
  backdropComponent?: BottomSheetProps["backdropComponent"];
  variant?: "standard" | "modal";
};

/**
 * A customizable BottomSheet component based on `@gorhom/bottom-sheet` with Material Design 3 styling.
 * It allows rendering custom content, defining snap points, and controlling
 * its state (open, close, snap, expand, collapse) via a ref.
 * The component is wrapped in a Portal to ensure it always appears on top.
 *
 * The variant prop controls the interaction behavior:
 * - "standard": Allows background content interaction (no backdrop)
 * - "modal": Blocks background content interaction (with backdrop)
 *
 * @param {Props} props - The component's props.
 * @param {Ref<BottomSheetRef>} ref - Ref to control the BottomSheet.
 * @returns {JSX.Element} The BottomSheet component.
 * @see {@link https://gorhom.github.io/react-native-bottom-sheet/|@gorhom/bottom-sheet Documentation}
 */
export const BottomSheet = forwardRef<BottomSheetRef, Props>(
  (
    {
      children,
      content,
      snapPoints: _snapPoints,
      title,
      initialSnapIndex = -1,
      onChange,
      backdropComponent,
      variant = "standard",
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme();
    const bottomSheetRef = useRef<BottomSheetOriginal>(null);

    const snapPoints = useMemo(
      () => _snapPoints || ["50%", "75%"],
      [_snapPoints],
    );

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
          pressBehavior={"close"}
          style={[props.style, { backgroundColor: theme.colors.backdrop }]}
        />
      ),
      [theme.colors.backdrop],
    );

    // variant="standard"の時はbackdropを無効にして背景操作を可能にする
    const getBackdropComponent = useCallback(() => {
      if (variant === "standard") {
        return undefined; // backdropなし = 背景操作可能
      }
      return backdropComponent || renderBackdrop;
    }, [variant, backdropComponent, renderBackdrop]);

    const BottomSheetTitle = ({ text }: { text: string }) => (
      <View style={styles.titleContainer}>
        <Typography variant="titleLarge">{text}</Typography>
        <Divider />
      </View>
    );

    // M3 compliant styles
    const m3HandleStyle = [
      styles.defaultHandleIndicator,
      { backgroundColor: theme.colors.onSurfaceVariant },
    ];

    const m3BackgroundStyle = [
      styles.defaultBackground,
      { backgroundColor: theme.colors.surface },
    ];

    const m3SheetStyle = [
      styles.defaultSheet,
      { shadowColor: theme.colors.shadow },
    ];

    return (
      <>
        {children}
        <Portal>
          <BottomSheetOriginal
            ref={bottomSheetRef}
            index={initialSnapIndex}
            snapPoints={snapPoints}
            onChange={onChange}
            backdropComponent={getBackdropComponent()}
            handleIndicatorStyle={m3HandleStyle}
            backgroundStyle={m3BackgroundStyle}
            style={m3SheetStyle}
            enablePanDownToClose={true}
            {...rest}
          >
            {title && <BottomSheetTitle text={title} />}
            <BottomSheetView style={styles.contentContainer}>
              {content}
            </BottomSheetView>
          </BottomSheetOriginal>
        </Portal>
      </>
    );
  },
);

const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  defaultHandleIndicator: {
    width: 32,
    height: 4,
    borderRadius: 2,
  },
  defaultBackground: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  defaultSheet: {
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
});

BottomSheet.displayName = "BottomSheet";
