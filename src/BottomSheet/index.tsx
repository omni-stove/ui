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
  useRef,
} from "react";
import { StyleSheet, View } from "react-native";
import { Portal } from "../Portal";
import { useTheme } from "../hooks";

/**
 * Ref interface for controlling the BottomSheet component.
 */
export type BottomSheetRef = {
  /** Opens the bottom sheet to the first snap point */
  open: () => void;
  /** Closes the bottom sheet */
  close: () => void;
  /** Snaps to a specific index */
  snapToIndex: (index: number) => void;
  /** Snaps to a specific position */
  snapToPosition: (position: string | number) => void;
  /** Expands the bottom sheet to the highest snap point */
  expand: () => void;
  /** Collapses the bottom sheet to the lowest snap point */
  collapse: () => void;
};

/**
 * Props for the BottomSheet component.
 * @param {ReactNode} [props.children] - Optional trigger element(s) or any other content to render alongside the sheet.
 * @param {ReactNode} props.content - The main content to be displayed inside the bottom sheet.
 * @param {(string | number)[]} [props.snapPoints=["50%", "75%"]] - An array of points to define the height of the bottom sheet when snapped. Defaults to `["50%", "75%"]`.
 * @param {number} [props.initialSnapIndex=-1] - The initial snap point index. Defaults to -1 (closed).
 * @param {(index: number) => void} [props.onChange] - Callback function triggered when the snap point changes.
 * @param {BottomSheetProps["backdropComponent"]} [props.backdropComponent] - Custom component for the backdrop. Defaults to `BottomSheetBackdrop`.
 * @param {"standard" | "modal"} [props.variant="standard"] - The variant of the bottom sheet. "standard" allows background interaction, "modal" blocks background interaction.
 */
type Props = {
  children?: ReactNode;
  content: ReactNode;
  snapPoints?: (string | number)[];
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
 * @param {React.Ref<BottomSheetRef>} ref - Ref to control the BottomSheet.
 * @returns {JSX.Element} The BottomSheet component.
 * @see {@link https://gorhom.github.io/react-native-bottom-sheet/|@gorhom/bottom-sheet Documentation}
 */
export const BottomSheet = forwardRef<BottomSheetRef, Props>(
  (
    {
      children,
      content,
      snapPoints = ["50%", "75%"],
      initialSnapIndex = -1,
      onChange,
      backdropComponent,
      variant = "standard",
    },
    ref,
  ) => {
    const theme = useTheme();
    const bottomSheetRef = useRef<BottomSheetOriginal>(null);

    // Expose methods through ref
    useImperativeHandle(ref, () => ({
      open: () => {
        bottomSheetRef.current?.snapToIndex(0);
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
      snapToIndex: (index: number) => {
        bottomSheetRef.current?.snapToIndex(index);
      },
      snapToPosition: (position: string | number) => {
        bottomSheetRef.current?.snapToPosition(position);
      },
      expand: () => {
        bottomSheetRef.current?.expand();
      },
      collapse: () => {
        bottomSheetRef.current?.collapse();
      },
    }));

    // Default backdrop component for modal variant
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      [],
    );

    const backgroundStyle = {
      backgroundColor: theme.colors.surfaceContainerLow,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
    };

    const handleStyle = {
      backgroundColor: theme.colors.surfaceContainerLow,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingVertical: 22,
    };

    const handleIndicatorStyle = {
      backgroundColor: theme.colors.onSurfaceVariant,
      width: 32,
    };

    // Material Design 3 specifications for bottom sheet sizing
    const containerStyle = {
      maxWidth: 640,
      marginHorizontal: "auto" as const,
      alignSelf: "center" as const,
    };

    return (
      <>
        {children}
        <Portal>
          <BottomSheetOriginal
            ref={bottomSheetRef}
            index={initialSnapIndex}
            snapPoints={snapPoints}
            onChange={onChange}
            enablePanDownToClose
            backdropComponent={
              variant === "modal"
                ? backdropComponent || renderBackdrop
                : undefined
            }
            backgroundStyle={backgroundStyle}
            handleStyle={handleStyle}
            handleIndicatorStyle={handleIndicatorStyle}
            style={containerStyle}
          >
            <BottomSheetView style={styles.container}>
              <View style={styles.content}>{content}</View>
            </BottomSheetView>
          </BottomSheetOriginal>
        </Portal>
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});

BottomSheet.displayName = "BottomSheet";
