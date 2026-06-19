export function AvatarFish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 5)">
        {/* Top fin */}
        <path d="M 36 22 Q 50 6 64 22 Q 55 20 50 21 Q 45 20 36 22 Z" fill="#F97316" />
        {/* Body */}
        <circle cx="50" cy="48" r="30" fill="#FB923C" />
        {/* Belly */}
        <ellipse cx="50" cy="54" rx="16" ry="18" fill="#FED7AA" />
        {/* Side fins */}
        <ellipse cx="17" cy="52" rx="11" ry="6" fill="#F97316" transform="rotate(-20, 17, 52)" />
        <ellipse cx="83" cy="52" rx="11" ry="6" fill="#F97316" transform="rotate(20, 83, 52)" />
        {/* Tail */}
        <path d="M 34 76 Q 50 92 66 76 Q 58 71 50 73 Q 42 71 34 76 Z" fill="#F97316" />
        {/* Eyes */}
        <circle cx="37" cy="40" r="9" fill="white" />
        <circle cx="63" cy="40" r="9" fill="white" />
        <circle cx="37" cy="40" r="5.5" fill="#1E293B" />
        <circle cx="63" cy="40" r="5.5" fill="#1E293B" />
        <circle cx="35" cy="38" r="2" fill="white" />
        <circle cx="61" cy="38" r="2" fill="white" />
        {/* Mouth */}
        <path d="M 43 56 Q 50 62 57 56" fill="none" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" />
        {/* Scale hints */}
        <path d="M 42 33 Q 50 40 42 47" fill="none" stroke="#EA580C" strokeWidth="1.5" opacity="0.35" />
        <path d="M 53 30 Q 61 37 53 44" fill="none" stroke="#EA580C" strokeWidth="1.5" opacity="0.35" />
      </g>
    </svg>
  );
}
