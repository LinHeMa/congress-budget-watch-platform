import { STATIC_ASSETS_PREFIX } from "~/constants/config";

const Image = ({
  src,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  props?: React.HTMLAttributes<HTMLImageElement>;
}) => {
  return <img src={STATIC_ASSETS_PREFIX + src} {...props} />;
};

export default Image;
