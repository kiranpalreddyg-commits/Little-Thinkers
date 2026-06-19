export function AvatarElf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 5)">
        {/* Hood back */}
        <circle cx="50" cy="40" r="30" fill="#166534" />
        {/* Face */}
        <circle cx="50" cy="44" r="23" fill="#FDE68A" />
        {/* Hood front frame */}
        <path d="M 20 36 Q 20 16 38 10 Q 50 6 62 10 Q 80 16 80 36 Q 72 48 50 50 Q 28 48 20 36 Z" fill="#15803D" />
        {/* Hood opening */}
        <ellipse cx="50" cy="40" rx="22" ry="20" fill="#FDE68A" />
        {/* Pointy ears */}
        <path d="M 28 38 L 18 28 L 27 42" fill="#FDE68A" />
        <path d="M 72 38 L 82 28 L 73 42" fill="#FDE68A" />
        {/* Eyes */}
        <circle cx="41" cy="38" r="5" fill="#166534" />
        <circle cx="59" cy="38" r="5" fill="#166534" />
        <circle cx="42" cy="37" r="1.8" fill="white" />
        <circle cx="60" cy="37" r="1.8" fill="white" />
        {/* Rosy cheeks */}
        <circle cx="34" cy="44" r="5" fill="#FCA5A5" opacity="0.4" />
        <circle cx="66" cy="44" r="5" fill="#FCA5A5" opacity="0.4" />
        {/* Smile */}
        <path d="M 42 49 Q 50 55 58 49" fill="none" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
        {/* Body / tunic */}
        <path d="M 26 68 Q 22 90 34 86 Q 50 92 66 86 Q 78 90 74 68 Q 62 64 50 64 Q 38 64 26 68 Z" fill="#15803D" />
        {/* Hood/collar bottom */}
        <ellipse cx="50" cy="64" rx="22" ry="6" fill="#166534" />
        {/* Belt */}
        <rect x="28" y="68" width="44" height="5" rx="2" fill="#166534" />
        {/* Belt buckle */}
        <rect x="43" y="68" width="14" height="5" rx="1.5" fill="#FBBF24" />
      </g>
    </svg>
  );
}
