/**
 * Line-art headframe on the surface horizon. The hoist rope drops into the
 * shaft and the page picks the line up again on every level below.
 */
export function Headframe({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 180"
      fill="none"
      className={className}
      aria-hidden
      strokeLinecap="round"
    >
      <g stroke="currentColor" strokeWidth="1.25">
        {/* Horizon */}
        <path d="M0 150.5H220" strokeWidth="1" />

        {/* Tower */}
        <path d="M74 150V44l34-28 34 28v106" />
        <path d="M74 44h68" />
        <path d="M74 74h68M74 104h68M74 128h68" strokeWidth="0.75" opacity="0.7" />
        <path d="M74 44l68 30M142 44L74 74" strokeWidth="0.75" opacity="0.55" />
        <path d="M74 74l68 30M142 74L74 104" strokeWidth="0.75" opacity="0.55" />

        {/* Back stays */}
        <path d="M142 50l58 100" />
        <path d="M168 104h20" strokeWidth="0.75" opacity="0.7" />

        {/* Sheave wheel */}
        <circle cx="108" cy="30" r="13" />
        <circle cx="108" cy="30" r="3.5" />

        {/* Hoist rope into the shaft */}
        <path d="M108 43v126" strokeDasharray="4 5" />

        {/* Cage */}
        <path d="M97 158h22v16H97z" />
        <path d="M108 152v6" />
      </g>
    </svg>
  );
}
