import { Avatar as AvatarOriginal } from "react-native-paper";

/**
 * Props for the Avatar component.
 * It can either display a label (text) or an image source.
 * If neither is provided, a default account icon is shown.
 *
 * @param {object} props - The component's props.
 * @param {string} [props.label] - The label to display as text in the Avatar. If provided, `source` should not be.
 * @param {string} [props.source] - The URI for an image to display in the Avatar. If provided, `label` should not be.
 */
type Props =
  | {
      label: string;
      source?: never;
    }
  | {
      label?: never;
      source: string;
    };

/**
 * Avatar component that displays a text label, an image, or a default icon.
 * This component wraps and extends the functionality of the Avatar components
 * from React Native Paper (`Avatar.Text`, `Avatar.Image`, `Avatar.Icon`).
 *
 * - If `label` is provided, it renders `Avatar.Text`.
 * - If `source` (image URI) is provided, it renders `Avatar.Image`.
 * - If neither `label` nor `source` is provided, it renders a default `Avatar.Icon` with an "account" icon.
 *
 * @param {Props} props - The component's props.
 * @returns {JSX.Element} The rendered Avatar component.
 * @see {@link https://callstack.github.io/react-native-paper/docs/components/Avatar/AvatarText/|React Native Paper Avatar.Text}
 * @see {@link https://callstack.github.io/react-native-paper/docs/components/Avatar/AvatarImage/|React Native Paper Avatar.Image}
 * @see {@link https://callstack.github.io/react-native-paper/docs/components/Avatar/AvatarIcon/|React Native Paper Avatar.Icon}
 */
export const Avatar = ({ label, source }: Props) => {
  if (label) {
    return <AvatarOriginal.Text label={label} />;
  }
  if (source) {
    return <AvatarOriginal.Image source={{ uri: source }} />;
  }
  return <AvatarOriginal.Icon icon="account" />;
};
