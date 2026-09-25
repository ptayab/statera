import Image from "next/image";
import { WindowChrome } from "@/components/WindowChrome";

type ProductShotProps = {
  title: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export function ProductShot({
  title,
  src,
  alt,
  width,
  height,
}: ProductShotProps) {
  return (
    <figure>
      <WindowChrome title={title}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          unoptimized
          className="h-auto w-full"
        />
      </WindowChrome>
    </figure>
  );
}
