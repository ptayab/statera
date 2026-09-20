import Image from "next/image";

type BrandLogoProps = {
  size?: number;
  showWordmark?: boolean;
  wordmarkClassName?: string;
};

export function BrandLogo({
  size = 34,
  showWordmark = true,
  wordmarkClassName = "font-display text-[22px] font-extrabold tracking-[-0.02em] text-statera-ink",
}: BrandLogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt={showWordmark ? "" : "Statera"}
        width={size}
        height={size}
        className={`${size >= 64 ? "rounded-2xl" : "rounded-lg"}`}
        priority
      />
      {showWordmark ? <span className={wordmarkClassName}>Statera</span> : null}
    </span>
  );
}
