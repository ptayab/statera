type BrandLogoProps = {
  light?: boolean;
};

export function BrandLogo({ light = false }: BrandLogoProps) {
  return (
    <span
      className={`font-display text-[1.45rem] leading-none font-medium tracking-[-0.03em] ${
        light ? "text-white" : "text-statera-ink"
      }`}
    >
      Statera
    </span>
  );
}
