export function AvatarMonkey({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 5)">
        {/* Ears */}
        <circle cx="18" cy="40" r="14" fill="#92400E" />
        <circle cx="82" cy="40" r="14" fill="#92400E" />
        <circle cx="18" cy="40" r="8" fill="#D97706" />
        <circle cx="82" cy="40" r="8" fill="#D97706" />
        {/* Tail */}
        <path d="M 72 75 Q 95 70 90 90 Q 85 95 80 88" fill="none" stroke="#92400E" strokeWidth="7" strokeLinecap="round" />
        {/* Body */}
        <ellipse cx="50" cy="68" rx="26" ry="22" fill="#92400E" />
        {/* Belly */}
        <ellipse cx="50" cy="70" rx="16" ry="14" fill="#34D399" />
        {/* Head */}
        <circle cx="50" cy="38" r="30" fill="#92400E" />
        {/* Face plate */}
        <ellipse cx="50" cy="44" rx="20" ry="18" fill="#D97706" />
        {/* Eyes */}
        <circle cx="40" cy="34" r="5.5" fill="white" />
        <circle cx="60" cy="34" r="5.5" fill="white" />
        <circle cx="41" cy="34" r="3.5" fill="#1E293B" />
        <circle cx="61" cy="34" r="3.5" fill="#1E293B" />
        <circle cx="42" cy="33" r="1" fill="white" />
        <circle cx="62" cy="33" r="1" fill="white" />
        {/* Nostrils */}
        <circle cx="46" cy="46" r="2.5" fill="#78350F" />
        <circle cx="54" cy="46" r="2.5" fill="#78350F" />
        {/* Mouth */}
        <path d="M 43 52 Q 50 57 57 52" fill="none" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        {/* Feet */}
        <ellipse cx="36" cy="88" rx="11" ry="6" fill="#78350F" />
        <ellipse cx="64" cy="88" rx="11" ry="6" fill="#78350F" />
      </g>
    </svg>
  );
}
