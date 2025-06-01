import { type ReactNode, useCallback, useEffect, useState } from "react";
import { BackHandler, Pressable, StyleSheet, View } from "react-native";
import { Icon, Dialog as PaperDialog, Portal } from "react-native-paper";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { Button } from "../Button";
import { Typography } from "../Typography";
import { useTheme } from "../hooks";

// --- Common Type Definitions ---

/**
 * Defines an action button for the dialog.
 * @param {string} label - The text to display on the button.
 * @param {() => void} onPress - Function to call when the button is pressed.
 */
type Action = {
  label: string;
  onPress: () => void;
};

// Dialog variant types
type DialogVariant = "basic" | "full-screen";

// Common props shared by all dialog variants
type CommonDialogProps = {
  headline: string;
  children: ReactNode;
  visible?: boolean;
  onDismiss?: () => void;
};

// Variant-specific conditional types
type ContentType<T extends DialogVariant | undefined> = T extends "full-screen"
  ? { content: ReactNode }
  : { content?: ReactNode };

type ActionsType<T extends DialogVariant | undefined> = T extends "full-screen"
  ? { actions: Action[] }
  : { actions?: Action[] };

type BasicSpecificProps<T extends DialogVariant | undefined> = T extends
  | "basic"
  | undefined
  ? {
      supportingText?: string;
      icon?: IconSource;
    }
  : Record<string, never>;

// Main dialog props type with conditional properties
type Props<T extends DialogVariant = "basic"> = CommonDialogProps & {
  variant?: T;
} & ContentType<T> &
  ActionsType<T> &
  BasicSpecificProps<T>;

/**
 * A component to display a dialog.
 * Dialogs inform users about a task and can contain critical information, require decisions, or involve multiple tasks.
 * This component extends the Dialog from React Native Paper with custom variants and simplified props.
 * The children prop serves as the trigger element that opens the dialog.
 *
 * @param {object} props - The component's props.
 * @param {string} props.headline - The dialog title.
 * @param {ReactNode} props.children - The trigger element that opens the dialog.
 * @param {ReactNode} [props.content] - Optional content for basic dialogs, required for fullscreen dialogs. Displayed in a scrollable area.
 * @param {boolean} [props.visible] - Controls dialog visibility externally.
 * @param {() => void} [props.onDismiss] - Function called when dialog is dismissed.
 * @param {"basic" | "full-screen"} [props.variant] - Dialog variant (default: "basic").
 * @param {string} [props.supportingText] - Supporting text for basic dialogs only.
 * @param {IconSource} [props.icon] - Icon for basic dialogs only.
 * @param {Action[]} [props.actions] - Action buttons (optional for basic, required for fullscreen).
 * @returns {JSX.Element} The Dialog component with trigger.
 */
export const Dialog = <T extends DialogVariant = "basic">(props: Props<T>) => {
  const {
    variant = "basic",
    visible,
    onDismiss,
    children,
    headline,
    actions,
    content,
  } = props;

  const theme = useTheme();
  const [internalVisible, setInternalVisible] = useState(false);

  const isActuallyVisible = visible !== undefined ? visible : internalVisible;

  const showDialog = useCallback(() => {
    if (visible === undefined) {
      setInternalVisible(true);
    }
  }, [visible]);

  const hideDialog = useCallback(() => {
    if (visible === undefined) {
      setInternalVisible(false);
    }
    onDismiss?.();
  }, [visible, onDismiss]);

  const handlePress = useCallback(() => {
    showDialog();
  }, [showDialog]);

  // Handle back button for full-screen dialog
  useEffect(() => {
    if (variant !== "full-screen" || !isActuallyVisible) {
      return;
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        hideDialog();
        return true;
      },
    );
    return () => backHandler.remove();
  }, [variant, isActuallyVisible, hideDialog]);

  if (variant === "full-screen") {
    return (
      <>
        <Pressable onPress={handlePress}>{children}</Pressable>
        {isActuallyVisible && (
          <View
            style={[StyleSheet.absoluteFillObject, styles.fullscreenOverlay]}
          >
            <View
              style={[
                styles.fullscreenContainer,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              {/* Header with title and actions */}
              <View
                style={[
                  styles.fullscreenHeader,
                  { backgroundColor: theme.colors.surfaceContainer },
                ]}
              >
                <View style={styles.fullscreenTitle}>
                  <Typography variant="headlineSmall" color="onSurface">
                    {headline}
                  </Typography>
                </View>
                <View style={styles.fullscreenActions}>
                  {actions?.map((action, index) => (
                    <Button
                      key={`action-${index}-${action.label}`}
                      variant="text"
                      onPress={() => {
                        action.onPress();
                        hideDialog();
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </View>
              </View>
              {/* Content area */}
              <View style={styles.fullscreenContent}>{content}</View>
            </View>
          </View>
        )}
      </>
    );
  }

  const { supportingText, icon } = props;

  return (
    <>
      <Pressable onPress={handlePress}>{children}</Pressable>
      <Portal>
        <PaperDialog
          visible={isActuallyVisible}
          onDismiss={hideDialog}
          style={{
            maxWidth: 560,
            minWidth: 280,
            alignSelf: "center",
          }}
        >
          <PaperDialog.Content>
            {icon && (
              <View style={{ alignItems: "center", marginBottom: 16 }}>
                <Icon source={icon} size={24} />
              </View>
            )}
            <View
              style={{
                alignItems: icon ? "center" : "flex-start",
                marginBottom: supportingText ? 16 : 0,
              }}
            >
              <Typography variant="headlineSmall" color="onSurface">
                {headline}
              </Typography>
            </View>
            {supportingText && (
              <View style={{ alignItems: icon ? "center" : "flex-start" }}>
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  {supportingText}
                </Typography>
              </View>
            )}
          </PaperDialog.Content>

          {content && (
            <PaperDialog.ScrollArea>{content}</PaperDialog.ScrollArea>
          )}

          {actions && actions.length > 0 && (
            <PaperDialog.Actions>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  justifyContent: "flex-end",
                }}
              >
                {actions.map((action, index) => (
                  <Button
                    key={`action-${index}-${action.label}`}
                    variant="text"
                    onPress={() => {
                      action.onPress();
                      hideDialog();
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </View>
            </PaperDialog.Actions>
          )}
        </PaperDialog>
      </Portal>
    </>
  );
};

Dialog.displayName = "Dialog";

const styles = StyleSheet.create({
  fullscreenOverlay: {
    zIndex: 9999,
    elevation: 24,
  },
  fullscreenContainer: {
    flex: 1,
  },
  fullscreenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  fullscreenTitle: {
    flex: 1,
  },
  fullscreenActions: {
    flexDirection: "row",
    gap: 8,
  },
  fullscreenContent: {
    flex: 1,
    padding: 16,
  },
  fullscreenContentContainer: {
    padding: 0,
  },
});
