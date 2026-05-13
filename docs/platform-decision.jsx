export default function PlatformDecision() {
  const factors = [
    ["REST API (POST/GET)", "✓ Works", "✓ Works, simpler", "g", "g"],
    ["Card content updates", "Needs app release", "✓ Instant deploy", "r", "g"],
    ["Sorbet Candy animations", "✓ Best possible", "✓ CSS is sufficient", "g", "g"],
    ["Streak / offline data", "✓ SQLite", "✓ IndexedDB", "g", "g"],
    ["Parent shares link", "✗ Must install first", "✓ Just send a URL", "r", "g"],
    ["Cross-platform", "2 codebases or framework", "✓ One codebase", "r", "g"],
    ["Ship a bug fix", "Submit → review → days", "✓ Deploy in minutes", "r", "g"],
    ["App Store fee", "$99/yr Apple + 30% IAP", "✓ Free", "r", "g"],
    ["Push notifications", "✓ Full support", "⚠ iOS 16.4+ only", "g", "a"],
    ["Discoverability", "✓ App Store listing", "SEO + direct links", "g", "a"],
    ["COPPA compliance", "Stricter in stores", "Easier to manage", "r", "g"],
  ];

  const pwaPoints = [
    ["Your REST API fits perfectly", "fetch() is native to the browser — no extra SDK, no platform abstraction layer needed."],
    ["Content cards update instantly", "New Tell Me Why topics or stories deploy the moment you push — no waiting for App Store review."],
    ["Parents share by link", "A parent can text a link to a child's teacher or share it in a school WhatsApp group. Zero install friction."],
    ["One team, one stack", "React or Angular, one codebase, runs identically on iOS Safari and Android Chrome."],
    ["Add to Home Screen", "On both iOS and Android, PWAs can be added to the home screen and launched full-screen — looks and feels native."],
    ["Service workers = offline", "Cache puzzle packs, stories, and Why topics locally. The app works on the school bus with no signal."],
  ];

  const nativeWhen = [
    "You need App Store discoverability as a primary growth channel",
    "You need Bluetooth, NFC, or advanced camera APIs",
    "Animation performance on budget Android devices proves insufficient (test first)",
    "You add audio recording or real-time multiplayer features later",
  ];

  const colG = "#16a34a", colR = "#dc2626", colA = "#d97706";
  const dotColor = { g: colG, r: colR, a: colA };

  return (
    <div style={{ fontFamily: "'Nunito', system-ui, sans-serif", maxWidth: 640, margin: "0 auto", padding: "24px 16px", color: "#1e1e2e" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
          Platform Decision — Little Thinkers
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#2D2D3A", lineHeight: 1.25 }}>
          Build a PWA, not a native app.
        </div>
        <div style={{ fontSize: 14, color: "#64748b", marginTop: 6, fontWeight: 600, lineHeight: 1.6 }}>
          Your REST API model, content-heavy design, and small team point squarely at a Progressive Web App.
          You get cross-platform coverage, instant updates, and zero store friction.
        </div>
      </div>

      {/* Two-col cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {/* Native */}
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#2D2D3A", marginBottom: 12 }}>📦 Native App</div>
          {[
            [colG, "Best animation performance"],
            [colG, "App Store listing"],
            [colG, "Full device API access"],
            [colR, "App Store review delays"],
            [colR, "iOS + Android = 2x work"],
            [colR, "30% Apple cut on payments"],
            [colR, "Every update = new release"],
            [colR, "Stricter COPPA in stores"],
          ].map(([c, t], i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: c, flexShrink: 0, marginTop: 5 }} />
              <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{t}</div>
            </div>
          ))}
        </div>

        {/* PWA */}
        <div style={{ background: "#F0FDF4", border: "2px solid #22c55e", borderRadius: 16, padding: 16, position: "relative" }}>
          <div style={{ position: "absolute", top: -1, right: 14, background: "#22c55e", color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: "0 0 8px 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Recommended</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#2D2D3A", marginBottom: 12 }}>🌐 PWA (Web App)</div>
          {[
            [colG, "One codebase, all devices"],
            [colG, "Deploy updates instantly"],
            [colG, "REST APIs are native to web"],
            [colG, "Share via link — no install"],
            [colG, "Offline via service workers"],
            [colG, "Add to home screen support"],
            [colA, "iOS push: needs iOS 16.4+"],
            [colA, "No App Store listing"],
          ].map(([c, t], i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: c, flexShrink: 0, marginTop: 5 }} />
              <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{t}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Factor comparison table */}
      <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
        Factor-by-factor breakdown
      </div>
      <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          {["Factor", "Native App", "PWA"].map((h, i) => (
            <div key={i} style={{ padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "#64748b" }}>{h}</div>
          ))}
        </div>
        {factors.map(([factor, native, pwa, nc, pc], i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr", background: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: i < factors.length - 1 ? "1px solid #f1f5f9" : "none" }}>
            <div style={{ padding: "9px 12px", fontSize: 12, color: "#374151", fontWeight: 600 }}>{factor}</div>
            <div style={{ padding: "9px 12px", fontSize: 12, color: dotColor[nc], fontWeight: 600 }}>{native}</div>
            <div style={{ padding: "9px 12px", fontSize: 12, color: dotColor[pc], fontWeight: 600 }}>{pwa}</div>
          </div>
        ))}
      </div>

      {/* Why PWA wins for this project */}
      <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
        Why PWA wins for Little Thinkers specifically
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {pwaPoints.map(([title, desc], i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 14px", borderLeft: "3px solid #43C6AC" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#2D2D3A", marginBottom: 3 }}>{title}</div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Tech Stack */}
      <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
        Recommended tech stack
      </div>
      <div style={{ background: "#1e1e2e", borderRadius: 14, padding: "16px 18px", marginBottom: 24, fontFamily: "monospace" }}>
        {[
          ["Frontend", "React (or Angular) + Tailwind CSS", "#F97794"],
          ["Animations", "CSS keyframes + Framer Motion (React) or Angular Animations", "#43C6AC"],
          ["PWA layer", "Vite PWA plugin or Angular @angular/pwa", "#4FACFE"],
          ["Offline", "Service Worker — cache cards, puzzles, stories", "#A78BFA"],
          ["Data storage", "localStorage + IndexedDB (for sessions + streak)", "#FFA040"],
          ["API calls", "fetch() — native, no library needed for REST POST/GET", "#43C6AC"],
          ["Hosting", "Vercel / Netlify / Firebase Hosting — free tier sufficient for MVP", "#F97794"],
          ["Backend", "Node.js + Express or Next.js API routes for your POST/GET endpoints", "#4FACFE"],
        ].map(([label, value, color], i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 7 ? 8 : 0, alignItems: "flex-start" }}>
            <div style={{ fontSize: 11, color: color, fontWeight: 700, minWidth: 90, paddingTop: 1 }}>{label}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* When to reconsider native */}
      <div style={{ background: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#92400E", marginBottom: 8 }}>⚠ Revisit native only if…</div>
        {nativeWhen.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, alignItems: "flex-start" }}>
            <div style={{ fontSize: 11, color: "#D97706", marginTop: 2, flexShrink: 0 }}>▸</div>
            <div style={{ fontSize: 12, color: "#78350F", lineHeight: 1.5 }}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
