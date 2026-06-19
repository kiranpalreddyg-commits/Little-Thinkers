export function AvatarBird({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 5)">
        <rect x="35" y="75" width="8" height="15" rx="4" fill="#F59E0B" />
        <rect x="57" y="75" width="8" height="15" rx="4" fill="#F59E0B" />
        <path d="M 20 50 Q 5 60 15 75 Q 25 60 25 50" fill="#2563EB" />
        <path d="M 80 50 Q 95 60 85 75 Q 75 60 75 50" fill="#2563EB" />
        <circle cx="50" cy="45" r="35" fill="#3B82F6" />
        <circle cx="50" cy="55" r="20" fill="#60A5FA" />
        <circle cx="38" cy="35" r="5" fill="#1E3A8A" />
        <circle cx="62" cy="35" r="5" fill="#1E3A8A" />
        <path d="M 43 42 L 57 42 L 50 52 Z" fill="#FBBF24" />
        <path d="M 45 10 Q 50 0 55 10 Q 50 5 45 10" fill="#2563EB" />
      </g>
    </svg>
  );
}
