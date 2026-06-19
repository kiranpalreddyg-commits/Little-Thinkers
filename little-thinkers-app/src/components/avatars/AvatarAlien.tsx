export function AvatarAlien({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 5)">
        {/* Antennae */}
        <line x1="38" y1="17" x2="30" y2="4" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
        <circle cx="28" cy="3" r="4.5" fill="#4ADE80" />
        <line x1="62" y1="17" x2="70" y2="4" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
        <circle cx="72" cy="3" r="4.5" fill="#4ADE80" />
        {/* Head */}
        <circle cx="50" cy="38" r="27" fill="#4ADE80" />
        {/* Big alien eyes */}
        <ellipse cx="37" cy="33" rx="10" ry="12" fill="#1E293B" />
        <ellipse cx="63" cy="33" rx="10" ry="12" fill="#1E293B" />
        <ellipse cx="34" cy="29" rx="3.5" ry="4.5" fill="#86EFAC" opacity="0.55" />
        <ellipse cx="60" cy="29" rx="3.5" ry="4.5" fill="#86EFAC" opacity="0.55" />
        {/* Smile */}
        <path d="M 40 50 Q 50 57 60 50" fill="none" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
        {/* Body */}
        <ellipse cx="50" cy="73" rx="20" ry="17" fill="#4ADE80" />
        {/* Belly spots */}
        <circle cx="44" cy="71" r="5" fill="#86EFAC" />
        <circle cx="57" cy="77" r="4" fill="#86EFAC" />
        {/* Arms */}
        <path d="M 30 66 Q 18 72 20 82" stroke="#4ADE80" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M 70 66 Q 82 72 80 82" stroke="#4ADE80" strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
