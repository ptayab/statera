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
      <div className="-mx-4 overflow-x-auto overscroll-x-contain px-4 sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="min-w-[34rem] sm:min-w-0">
          <WindowChrome title={title}>
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 960px, 150vw"
            />
          </WindowChrome>
        </div>
      </div>
      <figcaption className="mt-2 text-center text-[11px] opacity-60 sm:hidden">
        Swipe sideways to see the full screen
      </figcaption>
    </figure>
  );
}
