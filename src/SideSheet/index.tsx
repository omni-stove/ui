import {
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useId,
} from "react";
import {
  Dimensions,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { Button, IconButton, Modal, Portal, Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Divider } from "../Divider";
import { useSideSheetLayout } from "../Provider";
import { Typography } from "../Typography";
import { useTheme } from "../hooks";

const { width: screenWidth } = Dimensions.get("window");

/**
 * Props for the SideSheet component.
 */
type Props = {
  /** The visual variant of the side sheet. @default "standard" */
  variant?: "standard" | "modal";
  /** The trigger element that opens the side sheet. Typically a Button. */
  children?: ReactNode;
  /** The headline or title of the side sheet. */
  headline: string;
  /** The main content to be displayed within the side sheet. */
  content: ReactNode;
  /** Controls the open state of the side sheet. */
  isOpen?: boolean;
  /** Callback function invoked when the open state of the side sheet changes. */
  onOpenChange?: (isOpen: boolean) => void;
  /** An array of action buttons to display in the footer of the side sheet. */
  actions?: {
    /** The label text for the action button. */
    label: string;
    /** The visual variant of the action button. */
    variant?: "filled" | "outlined";
    /** Callback function invoked when the action button is clicked. */
    onClick: () => void;
  }[];
  /** Custom style for the side sheet container */
  style?: StyleProp<ViewStyle>;
  /** Width of the side sheet. @default 400 */
  width?: number;
  /** Position of the side sheet. @default "right" */
  position?: "left" | "right";
  /** Whether to show divider between content and side sheet. @default true */
  hasDivider?: boolean;
};

/**
 * A SideSheet component that can be displayed as a standard persistent panel
 * or as a modal. It typically appears from the left or right edge of the screen
 * to display supplementary content or actions.
 *
 * The component integrates with `SideSheetLayoutContext` (from `UIProvider`)
 * to manage its state and potentially affect the layout of other components
 * when in `standard` variant.
 *
 * @param {Props} props - The component's props.
 * @param {React.Ref<View>} ref - Ref for the main Surface container of the SideSheet.
 * @returns {JSX.Element} The SideSheet component.
 * @see {@link UIProvider}
 * @see {@link Portal}
 * @see {@link Modal}
 * @see {@link Surface}
 */
export const SideSheet = forwardRef<View, Props>(
  (
    {
      variant = "standard",
      children,
      headline,
      content,
      isOpen = false,
      onOpenChange,
      actions,
      style,
      width = 400,
      position = "right",
      hasDivider = true,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { registerSideSheet, unregisterSideSheet, updateSideSheet } =
      useSideSheetLayout();
    const sideSheetId = useId();

    const handleClose = useCallback(() => {
      onOpenChange?.(false);
    }, [onOpenChange]);

    const handleBackdropPress = useCallback(() => {
      if (variant === "modal") {
        handleClose();
      }
    }, [variant, handleClose]);

    const sideSheetWidth = Math.min(width, screenWidth * 0.9);

    useEffect(() => {
      registerSideSheet(sideSheetId, {
        isOpen,
        width: sideSheetWidth,
        position,
        variant,
      });
      return () => unregisterSideSheet(sideSheetId);
    }, [
      registerSideSheet,
      unregisterSideSheet,
      sideSheetId,
      isOpen,
      sideSheetWidth,
      position,
      variant,
    ]);

    useEffect(() => {
      updateSideSheet(sideSheetId, {
        isOpen,
        width: sideSheetWidth,
        position,
        variant,
      });
    }, [
      updateSideSheet,
      sideSheetId,
      isOpen,
      sideSheetWidth,
      position,
      variant,
    ]);

    const containerStyle = [
      variant === "standard" ? styles.standardSideSheet : styles.container,
      {
        [position]: 0,
        width: sideSheetWidth,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.surfaceContainerLow,
      },
      style,
    ];

    const backdropStyle = [styles.backdrop];

    const sideSheetContent = (
      <Surface
        ref={ref}
        style={containerStyle}
        elevation={variant === "modal" ? 3 : 1}
      >
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="headlineSmall" style={styles.headline}>
            {headline}
          </Typography>
          <IconButton
            icon="close"
            size={24}
            onPress={handleClose}
            style={styles.closeButton}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>{content}</View>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <>
            <Divider />
            <View style={styles.actions}>
              {actions.map((action, index) => (
                <Button
                  key={`action-${action.label}-${index}`}
                  mode={action.variant === "filled" ? "contained" : "outlined"}
                  onPress={action.onClick}
                  style={styles.actionButton}
                >
                  {action.label}
                </Button>
              ))}
            </View>
          </>
        )}
      </Surface>
    );

    return (
      <>
        {children}
        <Portal>
          {variant === "modal" ? (
            <Modal
              visible={isOpen}
              onDismiss={handleClose}
              contentContainerStyle={styles.modalContent}
              {...rest}
            >
              <View style={backdropStyle} onTouchEnd={handleBackdropPress}>
                {sideSheetContent}
              </View>
            </Modal>
          ) : (
            isOpen && (
              <View style={styles.standardPortalContainer}>
                {hasDivider && (
                  <View
                    style={[
                      styles.verticalDividerContainer,
                      position === "right"
                        ? { right: sideSheetWidth }
                        : { left: sideSheetWidth },
                    ]}
                  >
                    <Divider orientation="vertical" />
                  </View>
                )}
                {sideSheetContent}
              </View>
            )
          )}
        </Portal>
      </>
    );
  },
);

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  standardPortalContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    pointerEvents: "box-none",
  },
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    maxWidth: 400,
    minWidth: 280,
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  standardSideSheet: {
    position: "absolute",
    top: 0,
    bottom: 0,
    maxWidth: 400,
    minWidth: 280,
  },
  verticalDividerContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headline: {
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    margin: 0,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  actionButton: {
    minWidth: 64,
  },
});

SideSheet.displayName = "SideSheet";
