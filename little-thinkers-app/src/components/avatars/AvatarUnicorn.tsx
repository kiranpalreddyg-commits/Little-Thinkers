export function AvatarUnicorn({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 5)">
        {/* Legs */}
        <rect x="32" y="72" width="9" height="16" rx="4" fill="#E2E8F0" />
        <rect x="59" y="72" width="9" height="16" rx="4" fill="#E2E8F0" />
        {/* Body */}
        <ellipse cx="50" cy="58" rx="28" ry="24" fill="#F1F5F9" />
        {/* Head */}
        <circle cx="50" cy="35" r="28" fill="#F1F5F9" />
        {/* Mane streaks */}
        <path d="M 28 20 Q 20 35 25 50" stroke="#A78BFA" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M 26 26 Q 16 38 20 54" stroke="#F472B6" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M 30 16 Q 24 28 28 42" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Horn */}
        <polygon points="50,2 45,22 55,22" fill="#FCD34D" />
        <line x1="50" y1="4" x2="50" y2="20" stroke="#F59E0B" strokeWidth="1" />
        {/* Eyes */}
        <circle cx="40" cy="36" r="5" fill="#1E293B" />
        <circle cx="60" cy="36" r="5" fill="#1E293B" />
        <circle cx="42" cy="34" r="1.5" fill="white" />
        <circle cx="62" cy="34" r="1.5" fill="white" />
        {/* Cheeks */}
        <ellipse cx="36" cy="43" rx="5" ry="3" fill="#FBCFE8" opacity="0.7" />
        <ellipse cx="64" cy="43" rx="5" ry="3" fill="#FBCFE8" opacity="0.7" />
        {/* Mouth */}
        <path d="M 46 46 Q 50 50 54 46" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
