import { type ReactElement, useState, useCallback } from "react";
import { View, Pressable } from "react-native";
import { Dialog as PaperDialog, Icon, Portal } from "react-native-paper";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { Button } from "../Button";
import { Typography } from "../Typography";

/**
 * Defines the visual style of the dialog.
 * - `basic`: A standard dialog with title, content, and actions.
 * - `full-screen`: A full-screen dialog (not yet implemented).
 */
type Variant = "basic" | "full-screen";

/**
 * Defines an action button for the dialog.
 * @param {string} label - The text to display on the button.
 * @param {() => void} onPress - Function to call when the button is pressed.
 */
type Action = {
  label: string;
  onPress: () => void;
};

/**
 * Props for the Dialog component.
 * @param {Variant} [props.variant="basic"] - The visual style of the dialog.
 * @param {Action[]} [props.actions] - Array of action buttons to display.
 * @param {string} props.headline - The title/headline of the dialog.
 * @param {string} [props.supportingText] - Optional supporting text/description.
 * @param {IconSource} [props.icon] - Optional icon to display in the title.
 * @param {ReactElement} props.children - Trigger element that opens the dialog when pressed.
 * @param {boolean} [props.visible] - Controls the visibility of the dialog. If undefined, visibility is handled internally.
 * @param {() => void} [props.onDismiss] - Function to call when the dialog is dismissed.
 */
type Props = {
  variant?: Variant;
  actions?: Action[];
  headline: string;
  supportingText?: string;
  icon?: IconSource;
  children: ReactElement;
  visible?: boolean;
  onDismiss?: () => void;
};

/**
 * A component to display a dialog.
 * Dialogs inform users about a task and can contain critical information, require decisions, or involve multiple tasks.
 * This component extends the Dialog from React Native Paper with custom variants and simplified props.
 * The children prop serves as the trigger element that opens the dialog.
 *
 * @param {Props} props - The component's props.
 * @returns {JSX.Element} The Dialog component with trigger.
 */
export const Dialog = ({
  variant = "basic",
  actions,
  headline,
  supportingText,
  icon,
  children,
  visible,
  onDismiss,
}: Props) => {
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

  if (variant === "full-screen") {
    // TODO: Implement full-screen variant
    throw new Error("Full-screen variant is not yet implemented");
  }

  return (
    <>
      <Pressable onPress={handlePress}>{children}</Pressable>
      <Portal>
        <PaperDialog visible={isActuallyVisible} onDismiss={hideDialog}>
          <PaperDialog.Title>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: icon ? 16 : 0,
              }}
            >
              {icon && <Icon source={icon} size={24} />}
              <Typography variant="headlineSmall" color="onSurface">
                {headline}
              </Typography>
            </View>
          </PaperDialog.Title>

          {supportingText && (
            <PaperDialog.Content>
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                {supportingText}
              </Typography>
            </PaperDialog.Content>
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
