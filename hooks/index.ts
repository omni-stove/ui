import { useTheme as usePaperTheme } from "react-native-paper";

export const useTheme = () => {
  const paperTheme = usePaperTheme({ colors: {} });
  return paperTheme;
};
