export function AvatarBat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 5)">
        {/* Left wing */}
        <path d="M 30 45 Q 5 20 8 50 Q 10 65 28 62" fill="#3730A3" />
        <path d="M 30 45 Q 14 35 12 55" fill="#4338CA" opacity="0.6" />
        {/* Right wing */}
        <path d="M 70 45 Q 95 20 92 50 Q 90 65 72 62" fill="#3730A3" />
        <path d="M 70 45 Q 86 35 88 55" fill="#4338CA" opacity="0.6" />
        {/* Body */}
        <ellipse cx="50" cy="62" rx="20" ry="18" fill="#312E81" />
        {/* Head */}
        <circle cx="50" cy="40" r="26" fill="#312E81" />
        {/* Ears */}
        <polygon points="35,22 28,4 42,18" fill="#312E81" />
        <polygon points="65,22 72,4 58,18" fill="#312E81" />
        <polygon points="36,20 31,8 40,18" fill="#818CF8" />
        <polygon points="64,20 69,8 60,18" fill="#818CF8" />
        {/* Eyes */}
        <circle cx="40" cy="38" r="6" fill="#FCD34D" />
        <circle cx="60" cy="38" r="6" fill="#FCD34D" />
        <circle cx="40" cy="38" r="3.5" fill="#1E293B" />
        <circle cx="60" cy="38" r="3.5" fill="#1E293B" />
        <circle cx="41" cy="37" r="1" fill="white" />
        <circle cx="61" cy="37" r="1" fill="white" />
        {/* Cute fangs */}
        <rect x="46" y="47" width="3" height="5" rx="1.5" fill="white" />
        <rect x="51" y="47" width="3" height="5" rx="1.5" fill="white" />
        {/* Smile */}
        <path d="M 44 47 Q 50 52 56 47" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
        {/* Feet */}
        <ellipse cx="42" cy="80" rx="8" ry="4" fill="#1E1B4B" />
        <ellipse cx="58" cy="80" rx="8" ry="4" fill="#1E1B4B" />
      </g>
    </svg>
  );
}
