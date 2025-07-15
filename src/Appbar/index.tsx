import { type ReactNode, forwardRef } from "react";
import type { View } from "react-native";
import { Appbar as AppbarPrimitive } from "react-native-paper";

type Props = {
  content?: ReactNode;
  onBack?: () => void;
  actions?: {
    icon: string;
    onPress: () => void;
    accessibilityLabel?: string;
  }[];
  title?: string;
};

export const Appbar = forwardRef<View, Props>(
  ({ content, onBack, actions, title }, ref) => {
    return (
      <AppbarPrimitive.Header ref={ref}>
        {onBack && <AppbarPrimitive.BackAction onPress={onBack} />}
        {title && <AppbarPrimitive.Content title={title} />}
        {content}
        {actions?.map((action) => (
          <AppbarPrimitive.Action
            key={JSON.stringify(action)}
            icon={action.icon}
            onPress={action.onPress}
            accessibilityLabel={action.accessibilityLabel}
          />
        ))}
      </AppbarPrimitive.Header>
    );
  },
);
