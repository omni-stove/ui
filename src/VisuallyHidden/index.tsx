import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type VisuallyHiddenProps = {
  children: ReactNode;
};

/**
 * The VisuallyHidden component is used to hide elements visually.
 * This component will also hide the content from assistive technologies like screen readers.
 *
 * @param {VisuallyHiddenProps} props - The component's props.
 * @param {ReactNode} props.children - The content to be hidden.
 */
const VisuallyHidden = ({ children }: VisuallyHiddenProps) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    display: "none", // Hides the element visually and from screen readers.
  },
});

export { VisuallyHidden };
