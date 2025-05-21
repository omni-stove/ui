import { Avatar as AvatarOriginal } from "react-native-paper";

type Props =
  | {
      label: string;
      source?: never;
    }
  | {
      label?: never;
      source: string;
    };

export const Avatar = ({ label, source }: Props) => {
  if (label) {
    return <AvatarOriginal.Text label={label} />;
  }
  if (source) {
    return <AvatarOriginal.Image source={{ uri: source }} />;
  }
  return <AvatarOriginal.Icon icon="account" />;
};
