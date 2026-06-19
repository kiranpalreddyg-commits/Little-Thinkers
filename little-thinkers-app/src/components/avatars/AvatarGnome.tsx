export function AvatarGnome({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 5)">
        {/* Body */}
        <rect x="28" y="55" width="44" height="32" rx="10" fill="#166534" />
        {/* Belt */}
        <rect x="28" y="67" width="44" height="8" rx="2" fill="#78350F" />
        <rect x="46" y="68" width="8" height="6" rx="1" fill="#F59E0B" />
        {/* Head */}
        <circle cx="50" cy="48" r="22" fill="#FBBF24" />
        {/* Big hat */}
        <ellipse cx="50" cy="30" rx="26" ry="8" fill="#15803D" />
        <polygon points="50,4 30,30 70,30" fill="#15803D" />
        {/* Hat band */}
        <rect x="30" y="26" width="40" height="6" rx="2" fill="#166534" />
        <rect x="44" y="27" width="12" height="4" rx="1" fill="#F59E0B" />
        {/* Eyes */}
        <circle cx="43" cy="48" r="4" fill="#1E293B" />
        <circle cx="57" cy="48" r="4" fill="#1E293B" />
        <circle cx="44.5" cy="46.5" r="1.2" fill="white" />
        <circle cx="58.5" cy="46.5" r="1.2" fill="white" />
        {/* Rosy cheeks */}
        <ellipse cx="37" cy="53" rx="4" ry="3" fill="#FCA5A5" opacity="0.7" />
        <ellipse cx="63" cy="53" rx="4" ry="3" fill="#FCA5A5" opacity="0.7" />
        {/* Big beard */}
        <ellipse cx="50" cy="65" rx="18" ry="16" fill="#F1F5F9" />
        {/* Smile hidden by beard */}
        <path d="M 45 57 Q 50 61 55 57" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        {/* Feet */}
        <ellipse cx="38" cy="88" rx="10" ry="5" fill="#15803D" />
        <ellipse cx="62" cy="88" rx="10" ry="5" fill="#15803D" />
      </g>
    </svg>
  );
}
