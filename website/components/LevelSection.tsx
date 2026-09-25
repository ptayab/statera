import type { ReactNode } from "react";

type LevelSectionProps = {
  id?: string;
  /** Light paper, white, or the closing dark band. */
  tone?: "paper" | "white" | "ink";
  children: ReactNode;
};

const TONE = {
  paper: "bg-[#f6f4f0] text-statera-ink",
  white: "bg-white text-statera-ink",
  ink: "bg-[#141311] text-white",
};

export function LevelSection({
  id,
  tone = "white",
  children,
}: LevelSectionProps) {
  return (
    <section id={id} className={`scroll-mt-24 ${TONE[tone]}`}>
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">{children}</div>
    </section>
  );
}
