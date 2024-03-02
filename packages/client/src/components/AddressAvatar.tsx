import { AvatarComponent } from "@rainbow-me/rainbowkit";
import { toSvg } from "jdenticon";

export const AddressAvatar: AvatarComponent = ({ address, size }) => {
  const svgString = toSvg(address, 100);

  return (
    <img
      src={`data:image/svg+xml;base64,${btoa(svgString)}`}
      alt="avatar"
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
    />
  );
};
