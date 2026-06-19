export function AvatarWalrus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 5)">
        {/* Body */}
        <ellipse cx="50" cy="72" rx="30" ry="20" fill="#0EA5E9" />
        {/* Head */}
        <circle cx="50" cy="40" r="28" fill="#38BDF8" />
        {/* Belly */}
        <ellipse cx="50" cy="76" rx="20" ry="13" fill="#7DD3FC" />
        {/* Ear flaps */}
        <ellipse cx="23" cy="24" rx="9" ry="7" fill="#0EA5E9" transform="rotate(-25, 23, 24)" />
        <ellipse cx="77" cy="24" rx="9" ry="7" fill="#0EA5E9" transform="rotate(25, 77, 24)" />
        {/* Eyes */}
        <circle cx="38" cy="34" r="6" fill="#1E293B" />
        <circle cx="62" cy="34" r="6" fill="#1E293B" />
        <circle cx="36" cy="32" r="2" fill="white" />
        <circle cx="60" cy="32" r="2" fill="white" />
        {/* Muzzle */}
        <ellipse cx="50" cy="51" rx="15" ry="11" fill="#7DD3FC" />
        {/* Nose */}
        <ellipse cx="50" cy="47" rx="6" ry="4" fill="#0369A1" />
        <circle cx="48" cy="47" r="1.5" fill="#7DD3FC" />
        <circle cx="52" cy="47" r="1.5" fill="#7DD3FC" />
        {/* Whisker dots */}
        <circle cx="35" cy="52" r="1.5" fill="#0369A1" />
        <circle cx="40" cy="54" r="1.5" fill="#0369A1" />
        <circle cx="65" cy="52" r="1.5" fill="#0369A1" />
        <circle cx="60" cy="54" r="1.5" fill="#0369A1" />
        {/* Smile */}
        <path d="M 42 57 Q 50 62 58 57" fill="none" stroke="#0369A1" strokeWidth="2" strokeLinecap="round" />
        {/* Tusks */}
        <rect x="41" y="57" width="6" height="15" rx="3" fill="white" />
        <rect x="53" y="57" width="6" height="15" rx="3" fill="white" />
        {/* Flippers */}
        <ellipse cx="16" cy="76" rx="12" ry="6" fill="#0EA5E9" transform="rotate(-25, 16, 76)" />
        <ellipse cx="84" cy="76" rx="12" ry="6" fill="#0EA5E9" transform="rotate(25, 84, 76)" />
      </g>
    </svg>
  );
}
