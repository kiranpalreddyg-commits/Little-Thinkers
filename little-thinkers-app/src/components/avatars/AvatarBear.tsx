export function AvatarBear({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 5)">
        <circle cx="25" cy="25" r="14" fill="#D97706" />
        <circle cx="75" cy="25" r="14" fill="#D97706" />
        <circle cx="25" cy="25" r="7" fill="#F59E0B" />
        <circle cx="75" cy="25" r="7" fill="#F59E0B" />
        <circle cx="50" cy="50" r="38" fill="#F59E0B" />
        <ellipse cx="50" cy="62" rx="20" ry="16" fill="#FDE68A" />
        <ellipse cx="50" cy="56" rx="7" ry="5" fill="#78350F" />
        <path d="M 45 65 Q 50 70 50 65 Q 50 70 55 65" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        <circle cx="36" cy="42" r="4.5" fill="#78350F" />
        <circle cx="64" cy="42" r="4.5" fill="#78350F" />
      </g>
    </svg>
  );
}
