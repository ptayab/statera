type DemoVideoProps = {
  title?: string;
};

export function DemoVideo({
  title = "Statera workflow demo",
}: DemoVideoProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-black ring-1 ring-black/10">
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
