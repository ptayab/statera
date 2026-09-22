type DemoVideoProps = {
  title?: string;
};

export function DemoVideo({
  title = "Statera workflow demo",
}: DemoVideoProps) {
  return (
    <div className="-mx-4 max-w-[calc(100%+2rem)] overflow-hidden bg-black shadow-[0_28px_70px_-36px_rgba(0,0,0,0.55)] ring-1 ring-white/15 sm:mx-0 sm:max-w-none sm:rounded-2xl">
      <div className="relative aspect-video w-full bg-black">
        <iframe
          className="absolute inset-0 h-full w-full"
          src="https://www.youtube-nocookie.com/embed/wUa9cuKbi70?rel=0"
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
