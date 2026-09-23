"use client";

import { useEffect, useRef, type ReactNode } from "react";

type PlayWhenVisibleProps = {
  className?: string;
  children: ReactNode;
};

/**
 * Holds the CSS animations inside it on their first frame until the block
 * scrolls into view, so intro motion below the fold is not spent unseen.
 * Without JavaScript the animations simply run on load.
 */
export function PlayWhenVisible({ className, children }: PlayWhenVisibleProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const { top, bottom } = el.getBoundingClientRect();
    if (top < window.innerHeight * 0.75 && bottom > 0) return;

    const animations = el.getAnimations({ subtree: true });
    for (const animation of animations) {
      animation.pause();
      animation.currentTime = 0;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        for (const animation of animations) animation.play();
        observer.disconnect();
      },
      { rootMargin: "0px 0px -25% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
