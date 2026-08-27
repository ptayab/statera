import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  size?: number;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  href,
  size = 36,
  showWordmark = true,
  wordmarkClassName = "font-display text-xl leading-none tracking-[0.12em] text-zinc-900 dark:text-zinc-50",
  className = "",
  priority = false,
}: BrandLogoProps) {
  const mark = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.png"
        alt={showWordmark ? "" : "Statera"}
        width={size}
        height={size}
        className={`ring-1 ring-white/10 ${size >= 64 ? "rounded-2xl" : "rounded-md"}`}
        priority={priority}
      />
      {showWordmark ? <span className={wordmarkClassName}>STATERA</span> : null}
    </span>
  );

  if (!href) {
    return mark;
  }

  return (
    <Link href={href} className="inline-flex items-center" aria-label="Statera home">
      {mark}
    </Link>
  );
}
