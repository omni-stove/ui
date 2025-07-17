"use client";
import { Text as PaperText } from "react-native-paper";
import { useTheme } from "../hooks";
import type { Props } from "./types";

export const Typography = ({
  variant = "bodyMedium",
  color = "onSurface",
  children,
}: Props) => {
  const theme = useTheme();
  const textColor = theme.colors[color];

  return (
    <PaperText variant={variant} style={[{ color: textColor }]}>
      {children}
    </PaperText>
  );
};
