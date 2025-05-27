"use client";
// Remove React default import as jsx: "react-jsx" is used
import {
  Children,
  type ReactElement, // Import ReactElement type
  type ReactNode,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useRef,
} from "react";
import {
  type NativeSyntheticEvent,
  Platform, // Platformを追加
  type TextInput as RNTextInput, // TextInputがPaperと衝突するためエイリアス
  ScrollView,
  StyleSheet,
  type TextInputKeyPressEventData,
  View,
} from "react-native";
import { TextInput } from "react-native-paper"; // Keep TextInput from paper
import { Button } from "../Button"; // Import local Button
import { IconButton } from "../IconButton"; // Import local IconButton
import { Surface } from "../Surface"; // Import local Surface
import { Typography } from "../Typography";
import { useTheme } from "../hooks"; // Import useTheme from local hooks

/**
 * @typedef {object} WrapperProps
 * @property {ReactNode} children - The content of the chat.
 * @property {() => void | Promise<void>} [onSubmit] - Optional callback for when a message is submitted.
 */
type WrapperProps = {
  children: ReactNode;
  onSubmit?: () => void | Promise<void>;
};

/**
 * A wrapper component for the chat interface. It handles scrolling to the bottom when new messages are added or submitted.
 * @param {WrapperProps} props - The props for the component.
 * @returns {JSX.Element} The rendered wrapper component.
 */
const Wrapper = ({ children, onSubmit }: WrapperProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const theme = useTheme(); // Paperのthemeを使用

  const scrollToBottom = useCallback(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, []);

  const enhancedChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    // Use ReactElement without 'any' and cast props later
    const element = child as ReactElement;

    // Check props existence before using 'in' operator
    const props = element.props as Record<string, unknown>;

    const isInput = props && "onChange" in props && "onSubmit" in props;
    // Ensure props.children exists before accessing it
    const isContent = props && "children" in props && !isInput;

    if (isInput) {
      return cloneElement(element as ReactElement<InputProps>, {
        onSubmit: async () => {
          const currentOnSubmit = (props as InputProps).onSubmit;
          if (typeof currentOnSubmit === "function") {
            const result = currentOnSubmit();
            if (result instanceof Promise) {
              await result;
            }
          }
          scrollToBottom();
          if (onSubmit) {
            const result = onSubmit();
            if (result instanceof Promise) {
              await result;
            }
          }
        },
      });
    }

    if (isContent) {
      return cloneElement(element as ReactElement<ContentProps>, {
        // @ts-ignore TODO: fix type
        ref: scrollViewRef,
      });
    }

    return child;
  });

  return (
    <View style={[styles.flex1, { backgroundColor: theme.colors.background }]}>
      {enhancedChildren}
    </View>
  );
};

/**
 * @typedef {object} ContentProps
 * @property {ReactNode} children - The messages or other content to display within the chat.
 */
type ContentProps = {
  children: ReactNode;
};

/**
 * A component that displays the main content of the chat, typically a list of messages.
 * It's a scrollable view.
 * @param {ContentProps} props - The props for the component.
 * @param {Ref<ScrollView>} ref - The ref for the ScrollView.
 * @returns {JSX.Element} The rendered content component.
 */
const Content = forwardRef<ScrollView, ContentProps>(({ children }, ref) => {
  return (
    <ScrollView
      ref={ref}
      style={styles.flex1}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.contentInnerContainer}>{children}</View>
    </ScrollView>
  );
});

/**
 * @typedef {object} MessageProps
 * @property {ReactNode} children - The content of the message.
 * @property {"sent" | "received"} type - The type of the message, either "sent" or "received".
 * @property {string} [timestamp] - Optional timestamp for the message.
 * @property {boolean} [isRead] - Optional flag indicating if the message has been read (for sent messages).
 * @property {ReactNode} [metadata] - Optional additional metadata to display with the message.
 */
type MessageProps = {
  children: ReactNode;
  type: "sent" | "received";
  timestamp?: string;
  isRead?: boolean;
  metadata?: ReactNode;
};

/**
 * A component to display a single chat message.
 * @param {MessageProps} props - The props for the component.
 * @param {Ref<View>} ref - The ref for the View.
 * @returns {JSX.Element} The rendered message component.
 */
const Message = forwardRef<View, MessageProps>(
  ({ children, type, timestamp, isRead, metadata }, ref) => {
    const theme = useTheme();
    const messageStyle = [
      styles.messageBase,
      type === "sent" ? styles.messageSent : styles.messageReceived,
      type === "sent"
        ? { backgroundColor: theme.colors.primaryContainer }
        : { backgroundColor: theme.colors.surfaceVariant }, // surfaceVariant for received messages
    ];
    const textColorName =
      type === "sent" ? "onPrimaryContainer" : "onSurfaceVariant";

    return (
      <View style={styles.messageOuterContainer}>
        <Surface ref={ref} style={messageStyle} elevation={1}>
          {typeof children === "string" || typeof children === "number" ? (
            <Typography color={textColorName}>{children}</Typography>
          ) : (
            children
          )}
        </Surface>

        {(timestamp || (type === "sent" && isRead) || metadata) && (
          <View
            style={[
              styles.metadataContainer,
              type === "sent" ? styles.alignEnd : styles.alignStart,
            ]}
          >
            {timestamp && (
              <Typography variant="labelSmall" color="onSurfaceVariant">
                {timestamp}
              </Typography>
            )}
            {type === "sent" && isRead && (
              <Typography variant="labelSmall" color="primary">
                既読
              </Typography>
            )}
            {metadata &&
              (typeof metadata === "string" || typeof metadata === "number" ? (
                <Typography variant="labelSmall" color="onSurfaceVariant">
                  {metadata}
                </Typography>
              ) : (
                metadata
              ))}
          </View>
        )}
      </View>
    );
  },
);

/**
 * @typedef {object} InputProps
 * @property {string} value - The current value of the input.
 * @property {(value: string) => void} onChange - Callback for when the input value changes.
 * @property {() => void | Promise<void>} onSubmit - Callback for when the message is submitted.
 * @property {boolean} [disabled] - Optional flag to disable the input.
 */
type InputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void | Promise<void>;
  disabled?: boolean;
};

/**
 * A component for text input in the chat interface.
 * @param {InputProps} props - The props for the component.
 * @param {Ref<RNTextInput>} ref - The ref for the TextInput.
 * @returns {JSX.Element} The rendered input component.
 */
const Input = forwardRef<RNTextInput, InputProps>(
  // RNTextInputを使用
  ({ value, onChange, onSubmit, disabled }, ref) => {
    const theme = useTheme();
    const onKeyPress = useCallback(
      (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        // Assert type for web-specific properties
        const nativeEvent = e.nativeEvent as {
          key: string;
          metaKey?: boolean;
          ctrlKey?: boolean;
        };
        if (
          nativeEvent.key === "Enter" &&
          (nativeEvent.metaKey || nativeEvent.ctrlKey) &&
          Platform.OS === "web"
        ) {
          // WebでのCmd/Ctrl + Enter
          onSubmit();
        }
      },
      [onSubmit],
    );

    return (
      <Surface
        style={[styles.inputSurface, { backgroundColor: theme.colors.surface }]}
        elevation={2}
      >
        <View style={styles.inputInnerContainer}>
          <TextInput
            ref={ref}
            style={[styles.textInput, { color: theme.colors.onSurface }]}
            value={value}
            onChangeText={onChange}
            onKeyPress={onKeyPress}
            disabled={disabled}
            multiline
            placeholder="メッセージを入力..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            underlineColor="transparent" // PaperのTextInputのデフォルト下線を消す
            activeUnderlineColor="transparent" // PaperのTextInputのデフォルト下線を消す
            // dense // 少し高さを抑える
          />
          <IconButton
            icon="send" // Use string for icon name
            size="small" //自前のIconButtonは 'small' などの文字列を期待
            //自前のIconButtonはiconColorではなくcolor propかもしれないので、もしエラーが出たら確認
            // IconButtonのPropsを見ると、iconColorではなく、variantやselectedに応じて内部で決定される
            // ここではデフォルトの挙動に任せるか、必要ならvariantを指定
            // iconColor={
            //   disabled ? theme.colors.onSurfaceDisabled : theme.colors.primary
            // }
            onPress={onSubmit}
            disabled={disabled}
            style={styles.sendButton}
            // variant="standard" // 例えば standard variant を使うなど
          />
        </View>
      </Surface>
    );
  },
);

/**
 * @typedef {object} Action
 * @property {ReactNode} children - The content of the action button (not directly used if label is present).
 * @property {string} label - The label for the action button.
 * @property {() => void | Promise<void>} onPress - Callback for when the action button is pressed.
 */
type Action = {
  children?: ReactNode; // childrenはオプションに
  label: string;
  onPress: () => void | Promise<void>;
};

/**
 * @typedef {object} ActionsProps
 * @property {Action[]} actions - An array of action objects to display as buttons.
 */
type ActionsProps = {
  actions: Action[];
};

/**
 * A component to display a list of quick actions or suggested replies.
 * @param {ActionsProps} props - The props for the component.
 * @returns {JSX.Element} The rendered actions component.
 */
const Actions = ({ actions }: ActionsProps) => {
  // const theme = useTheme(); // theme is unused
  return (
    <View style={styles.actionsContainer}>
      {actions.map(({ onPress, label }) => (
        <Button
          key={label}
          onPress={onPress}
          variant="elevated" // 自前のButtonのvariant propを使用
          size="small" // compactの代わりにsize="small"を使用
          style={styles.actionButton}
          // textColor="primary" // variant="elevated" で disabled=false なら textColor は primary になるはず
        >
          {label}
        </Button>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 8, // パディングを少し調整
  },
  contentInnerContainer: {
    gap: 16, // メッセージ間のスペース
    flex: 1,
  },
  messageOuterContainer: {
    // メッセージとメタデータの間のスペースを管理
  },
  messageBase: {
    padding: 12,
    maxWidth: "80%",
    borderRadius: 12, // M3の角丸
    // borderWidth: 1, // PaperのSurfaceがelevationを持つので不要かも
  },
  messageSent: {
    alignSelf: "flex-end",
    // backgroundColor is set by theme
  },
  messageReceived: {
    alignSelf: "flex-start",
    // backgroundColor is set by theme
  },
  metadataContainer: {
    marginTop: 4,
    gap: 8,
    paddingHorizontal: 4,
  },
  alignEnd: {
    alignSelf: "flex-end",
  },
  alignStart: {
    alignSelf: "flex-start",
  },
  inputSurface: {
    padding: 8,
    borderRadius: 28, // M3のTextInput風の角丸
    margin: 8, // 周囲にマージン
  },
  inputInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: "transparent", // TextInput自体の背景は透明に
    paddingHorizontal: 8, // TextInput内のパディング
    minHeight: 40, // 最低限の高さを確保
    maxHeight: 120, // 最大の高さを設定 (複数行対応のため)
  },
  sendButton: {
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end", // 右寄せ
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionButton: {
    // backgroundColor is set by theme
    borderRadius: 16, // ボタンの角丸
  },
});

export const Chat = {
  Wrapper,
  Content,
  Message,
  Input,
  Actions,
};
