import type { ComponentProps, ReactNode } from "react";
import { Text as PaperText } from "react-native-paper";
import { useTheme } from "../hooks";
import type { Material3Colors } from "../hooks/types";

type PaperTextVariant = ComponentProps<typeof PaperText>["variant"];

type TypographyProps = {
  /**
   * The text variant.
   * Uses the variant from the react-native-paper Text component.
   * @default 'bodyMedium'
   * @see https://callstack.github.io/react-native-paper/docs/components/Text/
   */
  variant?: PaperTextVariant;
  /**
   * The text color.
   * Specifies a color defined in ExtendedTheme.
   * @default 'onSurface'
   */
  color?: keyof Material3Colors;
  /**
   * The content to display.
   */
  children: ReactNode;
};

/**
 * A component for displaying text.
 * This component extends the react-native-paper Text component,
 * allowing color specification from ExtendedTheme.
 *
 * @param {TypographyProps} props - The component's props.
 * @param {PaperTextVariant} [props.variant='bodyMedium'] - The variant of the react-native-paper Text component.
 * @param {keyof Material3Colors} [props.color='onSurface'] - The color defined in ExtendedTheme.
 * @param {ReactNode} props.children - The child elements to render.
 * @returns {ComponentProps<typeof PaperText>} Returns the PaperText component.
 */
export const Typography = ({
  variant = "bodyMedium",
  color = "onSurface",
  children,
}: TypographyProps) => {
  const theme = useTheme();
  const textColor = theme.colors[color];

  return (
    <PaperText variant={variant} style={[{ color: textColor }]}>
      {children}
    </PaperText>
  );
};
