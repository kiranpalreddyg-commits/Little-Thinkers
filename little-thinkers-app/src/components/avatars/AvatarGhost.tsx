export function AvatarGhost({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 5)">
        <path
          d="M 20 50 C 20 20, 80 20, 80 50 L 80 80 Q 72.5 90, 65 80 Q 57.5 90, 50 80 Q 42.5 90, 35 80 Q 27.5 90, 20 80 Z"
          fill="#F9A8D4"
        />
        <circle cx="38" cy="45" r="4" fill="#831843" />
        <circle cx="62" cy="45" r="4" fill="#831843" />
        <path d="M 45 55 Q 50 60 55 55" fill="none" stroke="#831843" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
