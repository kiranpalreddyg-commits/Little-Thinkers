export function AvatarWitch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 5)">
        {/* Hair sides */}
        <path d="M 25 56 Q 18 70 22 82" stroke="#D97706" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M 75 56 Q 82 70 78 82" stroke="#D97706" strokeWidth="10" fill="none" strokeLinecap="round" />
        {/* Hat cone */}
        <path d="M 26 34 Q 46 34 50 4 Q 54 34 74 34 Z" fill="#6D28D9" />
        {/* Hat brim */}
        <rect x="20" y="30" width="60" height="8" rx="4" fill="#7C3AED" />
        {/* Hat band */}
        <rect x="26" y="30" width="48" height="5" rx="2" fill="#8B5CF6" />
        {/* Star on hat */}
        <polygon points="50,9 52,16 59,16 53,20 55,27 50,23 45,27 47,20 41,16 48,16" fill="#FCD34D" />
        {/* Head */}
        <circle cx="50" cy="56" r="22" fill="#FDE68A" />
        {/* Eyes */}
        <circle cx="41" cy="52" r="5" fill="#1E293B" />
        <circle cx="59" cy="52" r="5" fill="#1E293B" />
        <circle cx="42" cy="51" r="1.8" fill="white" />
        <circle cx="60" cy="51" r="1.8" fill="white" />
        {/* Rosy cheeks */}
        <circle cx="34" cy="58" r="5" fill="#F9A8D4" opacity="0.5" />
        <circle cx="66" cy="58" r="5" fill="#F9A8D4" opacity="0.5" />
        {/* Smile */}
        <path d="M 42 63 Q 50 69 58 63" fill="none" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
        {/* Body / cloak */}
        <path d="M 28 76 Q 23 94 36 90 Q 50 96 64 90 Q 77 94 72 76 Q 62 72 50 72 Q 38 72 28 76 Z" fill="#6D28D9" />
        {/* Collar */}
        <ellipse cx="50" cy="76" rx="20" ry="6" fill="#7C3AED" />
      </g>
    </svg>
  );
}
