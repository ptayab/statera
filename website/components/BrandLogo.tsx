type BrandLogoProps = {
  wordmarkClassName?: string;
};

export function BrandLogo({
  wordmarkClassName = "font-display text-[22px] font-extrabold tracking-[-0.02em] text-statera-ink",
}: BrandLogoProps) {
  return <span className={wordmarkClassName}>Statera</span>;
}
