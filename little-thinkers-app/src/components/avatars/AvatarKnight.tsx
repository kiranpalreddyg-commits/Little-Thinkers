export function AvatarKnight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 5)">
        {/* Helmet dome */}
        <path d="M 20 40 Q 20 10 50 8 Q 80 10 80 40 L 80 48 Q 66 54 50 54 Q 34 54 20 48 Z" fill="#1D4ED8" />
        {/* Plume */}
        <path d="M 44 8 Q 50 0 56 8 Q 53 10 50 9 Q 47 10 44 8 Z" fill="#DC2626" />
        {/* Visor opening */}
        <rect x="28" y="30" width="44" height="14" rx="3" fill="#93C5FD" />
        {/* Face in visor */}
        <ellipse cx="50" cy="37" rx="17" ry="6" fill="#FDE68A" />
        {/* Visor bars */}
        <line x1="28" y1="37" x2="72" y2="37" stroke="#1E40AF" strokeWidth="2" opacity="0.6" />
        {/* Eyes */}
        <circle cx="40" cy="37" r="3.5" fill="#1E293B" />
        <circle cx="60" cy="37" r="3.5" fill="#1E293B" />
        <circle cx="41" cy="36" r="1.2" fill="white" />
        <circle cx="61" cy="36" r="1.2" fill="white" />
        {/* Helmet brim */}
        <rect x="17" y="46" width="66" height="7" rx="3" fill="#1E40AF" />
        {/* Pauldrons */}
        <ellipse cx="20" cy="62" rx="12" ry="9" fill="#1E40AF" />
        <ellipse cx="80" cy="62" rx="12" ry="9" fill="#1E40AF" />
        {/* Body / chest plate */}
        <rect x="28" y="58" width="44" height="28" rx="8" fill="#1D4ED8" />
        {/* Chest detail */}
        <path d="M 34 60 L 50 68 L 66 60" fill="none" stroke="#3B82F6" strokeWidth="2" />
        {/* Belt */}
        <rect x="28" y="74" width="44" height="7" rx="2" fill="#1E3A8A" />
        {/* Belt buckle */}
        <rect x="43" y="75" width="14" height="5" rx="1.5" fill="#FBBF24" />
      </g>
    </svg>
  );
}
