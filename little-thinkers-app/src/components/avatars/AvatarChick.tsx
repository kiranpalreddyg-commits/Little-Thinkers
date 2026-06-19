export function AvatarChick({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 5)">
        <rect x="40" y="75" width="6" height="12" rx="3" fill="#EA580C" />
        <rect x="54" y="75" width="6" height="12" rx="3" fill="#EA580C" />
        <ellipse cx="50" cy="50" rx="30" ry="32" fill="#FBBF24" />
        <ellipse cx="20" cy="55" rx="8" ry="15" fill="#F59E0B" />
        <ellipse cx="80" cy="55" rx="8" ry="15" fill="#F59E0B" />
        <circle cx="45" cy="15" r="6" fill="#EF4444" />
        <circle cx="55" cy="15" r="6" fill="#EF4444" />
        <circle cx="50" cy="10" r="7" fill="#EF4444" />
        <circle cx="40" cy="40" r="4" fill="#78350F" />
        <circle cx="60" cy="40" r="4" fill="#78350F" />
        <ellipse cx="50" cy="48" rx="8" ry="5" fill="#EA580C" />
      </g>
    </svg>
  );
}
