---
stepsCompleted: ["step-01-init", "step-02c-executive-summary", "step-03-success", "step-04-journeys", "step-05-domain", "step-06-innovation", "step-07-project-type", "step-08-scoping", "step-09-functional", "step-10-nonfunctional", "step-11-polish", "step-12-complete"]
releaseMode: single-release
inputDocuments: []
workflowType: 'prd'
documentCounts:
  briefCount: 0
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 0
---

# Product Requirements Document - little-thinkers

**Author:** User
**Date:** May 9, 2026

## Executive Summary

**Little Thinkers** is a Progressive Web App (PWA) designed to enhance cognitive skills in children aged 7-15 through engaging brain games and educational content. The app delivers five initial puzzle-based games—Word Pop (Wordle-inspired), Connection Quest (Connections-inspired), Memory Flip, Pattern Builder, and Grid Logic—that target problem-solving, memory, vocabulary, logic, and pattern recognition. Complementing the games are three core sections on the home page: "Tell Me Why?" featuring science curiosity topics (e.g., "Why do matches catch fire?", "Why does cooked shrimp turn red?", "How do airplanes fly?"), "Story Time" with short stories and morals, and "Puzzle of the Day" for daily brain challenges.

Unlike traditional educational games that emphasize winning, Little Thinkers rewards the thinking process itself with immediate "aha" feedback, tactile animations, and mascot reactions.

The product differentiates through customizable UI options that maintain a playful, bright, and tactile feel while being polished and modern, paired with a comprehensive reward system:
- Brain Jar that accumulates Thought Sparks for correct answers
- Thinker Badges based on puzzle-solving approaches, not just completion
- World map progression across themed areas (Word Woods, Connection Canyon, Memory Marsh, Pattern Peaks, Logic Lab)
- Daily thinking streaks for engagement
- Mascot evolution with accessories and levels
- Parent Zone with weekly Brain Reports and printable "Super Thinker" certificates

Operating in the edtech domain with medium complexity, the app addresses key concerns including COPPA/FERPA compliance for child privacy through data minimization and parental controls, WCAG accessibility standards, content moderation, and curriculum alignment. The PWA architecture ensures cross-device compatibility, installable app-like experience, and network-resilient progress sync without native development overhead. Content expansion (additional games, stories, and science topics) is designed for scalability without performance degradation.

Target users include children seeking fun cognitive challenges and parents valuing measurable educational engagement. The app's calm, encouraging tone maintains appeal for older children while remaining accessible to younger players. By emphasizing process over outcome, Little Thinkers stands apart from competitors like ABCmouse or Prodigy through deeper cognitive skill development and adaptive rewards that scale with the child's age and progress. Future roadmap includes expanded content libraries and advanced analytics for personalized learning paths.

## Success Criteria

### Launch Gates (Day 1 Requirements)

**Compliance & Security:**
- COPPA Compliance: 100% regulatory compliance with zero critical findings in audit
- Security Audit: Annual third-party security audit with zero critical or high-severity findings
- Data Protection: Encryption at rest and in transit validated by security audit

**Core Technical Performance:**
- PWA Load Time: First contentful paint within 2 seconds on 4G networks (measured via Lighthouse)
- Lighthouse Performance Score: 85+ on mobile, 90+ on desktop (tracked via automated testing)
- Cross-Platform Functionality: 95%+ functional parity across iOS Safari, Android Chrome, and desktop browsers

**Accessibility:**
- WCAG 2.1 AA Compliance: All UI accessible to screen readers; keyboard navigation: 100% of game UI and Parent Zone navigable without mouse
- Measurement Method: Automated accessibility audits + quarterly manual testing

### Growth Targets (3-6 Month Horizon)

**User Engagement by Cohort:**
- Younger Cohort (7-10 years): 60%+ 7-day retention, 35%+ 30-day retention
- Older Cohort (11-15 years): 65%+ 7-day retention, 45%+ 30-day retention
- Measurement Method: In-app analytics event tracking

**Child Experience Metrics:**
- Daily Active Users (DAU): Target 15-25% month-over-month growth
- Session Duration: Average 12-20 minute sessions per engagement
- Skill Improvement: Measurable cognitive gains in target domains (problem-solving, memory, vocabulary, logic, pattern recognition) within 4-week intervals, tracked via pre/post assessments
- Child Confidence: 80%+ of users report feeling "smarter" or "good at thinking" after 2 weeks of use (measured via in-app post-session micro-surveys)
- Measurement Method: In-app analytics, embedded confidence surveys

**Parent Engagement & Experience:**
- Weekly Report Adoption: 70%+ of parents access weekly Brain Reports within 7 days of generation
- Parent Comprehension: 90%+ of parents can articulate their child's top 2 cognitive strengths after reading the report (measured via exit survey)
- Badge Sharing: 40%+ of earned Thinker Badges are shared with family (tracked via share button analytics)
- Moment of Pride: 85%+ of parents report their child showed them a badge or report unprompted within 30 days (measured via parent survey)
- Parent Engagement Frequency: Parents log in 3+ times per week to view progress and reports
- Measurement Method: Analytics tracking, embedded surveys, weekly report open rates

**Business Metrics:**
- Premium Conversion Rate: X% of free users converting to paid tier within 30 days (specific % TBD based on monetization model)
- User Acquisition Cost (CAC): $X per user
- Lifetime Value (LTV): $Y per user; target LTV:CAC ratio of 3:1 or higher
- Measurement Method: Attribution tracking, subscription analytics

### Technical Reliability & Performance Targets

**Network Resilience:**
- Network-required gameplay with graceful reconnect and progress persistence for brief interruptions
- Sync Success Definition: 100% of gameplay progress saved on reconnection; sync completion within 30 seconds of reconnection
- Measurement Method: Automated reconnect testing, error logging

**Accessibility Beyond Compliance:**
- Keyboard Navigation: 100% of interactive elements accessible via keyboard; Tab order logical and predictable across all screens
- Screen Reader Testing: Tested and validated with NVDA (Windows) and JAWS (Windows/Mac)
- Measurement Method: Manual keyboard navigation audits, automated screen reader testing

### North Star Metrics (Long-Term, Directional)

**Educational Impact:**
- Cognitive Skill Assessments: Pre/post assessments showing measurable improvement (target: 30%+ average improvement in target cognitive domains within 12 weeks of consistent use)
- Parent Feedback Score: 4.5+ star rating for educational value and engagement quality (measured via quarterly parent surveys)
- Net Promoter Score (NPS): 60+ NPS indicating strong parent satisfaction and likelihood to recommend
- Measurement Method: Embedded assessments, quarterly surveys

**Emotional & Social Success:**
- Child Pride Moments: Anecdotal evidence of unprompted sharing of badges and certificates with peers, teachers, or family members (tracked via testimonials, parent feedback)
- Thinking Streak Consistency: Average user maintaining 8+ day thinking streaks by month 3 (indicates habit formation)
- Mascot Engagement: 85%+ of users evolving their mascot within 30 days (indicates continued engagement with rewards)
- Measurement Method: User testimonials, social sharing analytics, mascot progression tracking

**Community & Reach:**
- App Store Ratings: 4.3+ stars on iOS App Store and Google Play Store (for installable PWA versions)
- Monthly Active Users (MAU): Growth trajectory toward X MAU by 12 months
- Family Ecosystem: 50%+ of child users have a parent with an active Parent Zone account
- Measurement Method: App store reviews, analytics dashboard, account linking tracking

## User Journeys

### Journey 1: Younger Child Learner (Aiden, 8 years old) - With Accessibility Options

Aiden can choose between "Smart Mode" (full rewards system with streaks and badges) or "Chill Mode" (no streaks, no pressure to return, just play and enjoy). He picks Smart Mode and opens Little Thinkers, seeing the bright home screen with three sections: "Puzzle of the Day," "Tell Me Why?," and "Story Time."

He taps "Puzzle of the Day" and sees Word Pop with difficulty options: Easy (3-letter words), Medium (5-letter words), Hard (6+ letter words). He starts with Easy, solves it correctly, sees a satisfying animation, earns a "Word Wizard" badge, and a Thought Spark fills his Brain Jar.

The next day, Aiden plays again to maintain his 2-day streak. On day 3, he misses because he's sick. The app says: "Hope you feel better! Streaks pause when you're away. Keep playing when you're back." His streak pauses instead of resetting. When he returns and plays, his 3-day streak resumes.

Later, Aiden explores "Tell Me Why?" and learns why matches catch fire. He reads a short story with a kindness moral in "Story Time." He shows his mom his badges and asks if he can see his friend's badges too. His mom checks the app settings and says she'll get back to him about friend features.

Mom checks the Parent Zone and chooses between two dashboard views: Quick View (just one metric showing engagement frequency) or Full View (detailed cognitive skill improvements, badges earned, story engagement). She picks Quick View because she doesn't want to micro-manage. She prints a certificate and puts it on the fridge. Aiden feels proud.

Aiden returns 5+ days a week, building consistent engagement without anxiety about streaks. His progression feels natural: as he masters Easy, the app suggests Medium puzzles. His mascot evolves, and he loves showing badges to his mom. When he takes breaks, he knows they won't hurt his streak.

**Failure & Recovery:** If Aiden loses a puzzle, he gets "Nice try! Want to try again, or pick a different game?" with no penalty. If the app loses connection, it saves state locally and resumes seamlessly when he reconnects. If he uninstalls and reinstalls, his account links to his parent's account and progress restores from cloud backup. If internet drops mid-game, the game pauses safely and resumes exactly where he left off.

**Capabilities Revealed:** Chill Mode option for neurodivergent/anxious kids, difficulty progression within each game, pause streaks during hiatuses, dual parent dashboards, friend features flagged as open question pending safety/COPPA review, robust reconnect/resume behavior with cloud sync recovery, progressive difficulty scaling.

---

### Journey 2: Older Child Learner (Maya, 14 years old) - With Progression & Social Features

Maya downloads Little Thinkers after her friend's recommendation. The onboarding asks: "How do you like to play?" She picks "Challenge Mode" (harder puzzles, leaderboards, no mandatory social features).

She tackles Connection Quest and struggles on her first puzzle. The app shows a hint system: Hint 1 (free) shows partial guidance, Hint 2 (costs 1 Thought Spark) gives more detail, Hint 3 (costs 2 Thought Sparks) shows the full solution. She uses Hint 1, figures it out, and earns a "Connection Champion" badge for solving with 1 hint—the badge system measures HOW she solves, not just IF she solves.

After solving 5 Connection Quest puzzles, the app unlocks the next difficulty tier: "Connection Quest Pro." She's excited by the progression curve. She also gains access to "Pattern Builder Extreme" and wants to tackle it.

She checks the world map (Connection Canyon, Pattern Peaks, etc.) and sees her progress: 60% of Connection Canyon complete. A boss puzzle at 100% unlocks a new themed area. She wants to beat it.

Maya notices she can optionally share badges with friends or keep them private. She enables friend features and sees her best friend is already playing. They both earned the same "Logic Master" badge on the same day. She feels a connection—someone she knows is on the same journey.

Maya realizes there's a real progression system, not random puzzles. The difficulty curve feels natural. Friend features are opt-in and respected. She plays 5+ days a week, motivated by progression, themed worlds, and optional friend visibility.

**Failure & Recovery:** If Maya loses a puzzle, the hint system lets her recover without feeling stuck. If she hits a difficulty spike, she can drop back to the previous tier or try a different game. If friend sync fails, she still sees her own progress and friend data syncs later. If she wants to quit friend features, she toggles off anytime and existing visibility disappears.

**Capabilities Revealed:** Challenge Mode option, hint system tied to badge achievement types, difficulty progression tiers (Normal → Pro → Elite), world map with themed area progression and boss puzzles, opt-in friend features with privacy controls, progressive unlock system.

---

### Journey 3: Parent/Guardian (James, Dad) - With Data Privacy & COPPA Clarity

James installs Little Thinkers for his kids and is asked during setup: "How often would you like reports?" (Weekly, Bi-weekly, Monthly), "How much detail?" (Quick summary, Full analytics), and "Enable friend features?" (Yes, No, Ask kids). He picks Weekly, Quick Summary, and "Ask Kids." He's also shown a Privacy & Data page documenting encryption, COPPA compliance, and data deletion rights (30-day SLA). He prints a copy for his records.

James receives his first weekly Brain Report in 2 minutes: "Your daughter completed 12 activities (5 games, 4 stories, 3 science topics). Skills improving: Vocabulary (+8%), Logic (+5%). This week's achievement: Memory Master badge." That's it—no overwhelming dashboards. He also gets a printable "Super Thinker" certificate.

After 3 weeks, James gets a quarterly assessment: Pre-assessment (week 1): 65% on pattern recognition. Post-assessment (week 4): 78% on pattern recognition. Improvement: +13%. He shows his wife; they're impressed by the measurable progress.

Two months later, the app asks: "Do you want to see your daughter's friend badges?" James enables it, and now sees his daughter and her best friend earning similar badges, which makes him feel confident about the peer connection.

James never logs into a "Full Dashboard." He only gets his 2-minute weekly emails. The app respects his time. He feels confident his kids are learning real skills with measurable progress, knows data complies with COPPA, and can delete everything anytime.

**Failure & Recovery:** If James wants to delete his child's account, he selects "Delete Account"; app confirms "All data will be deleted in 30 days. During this time, you can cancel the deletion." After 30 days, account is gone. If the child's email changes, James updates it in parent settings and data persists. If James forgets his password, recovery email is sent and the child's data stays safe.

**Capabilities Revealed:** Privacy agreement with COPPA compliance shown during setup, data deletion workflows (30-day SLA with cancellation), encryption at rest and in transit, parent consent and parental controls, optional friend feature visibility controls, quarterly skill assessments with pre/post measurements, quick vs. detailed report options.

---

### Journey 4: Admin/Content Manager (Sofia) - With Backup, Delegation & A/B Testing

Sofia logs into the Admin Panel to upload new content. The system shows publishing status (5 in queue, 12 published this month), team roster (Sofia + 2 backup admins), and approval workflow (Draft → Review → Staging → Live).

Sofia prepares "Why do octopuses have three hearts?" She enters metadata: title, age range (7+), cognitive skill (curiosity, biology), themed area (Connection Canyon), target launch (next Friday). She uploads images (auto-checked for accessibility: alt-text required, file optimization). The system validates reading level: Grade 3-4 (appropriate for 7+). She submits to review.

Her teammate Mark (backup admin) reviews in 4 hours: "Approved. Move to staging." Sofia moves it to staging. The system generates preview links for iOS, Android, and desktop. Sofia tests on her phone; the article renders beautifully. She decides to A/B test: Variant A (article only) vs. Variant B (article + interactive quiz). She sets up both in staging, tests, and schedules Friday 9am launch.

Sofia publishes to 50k active users in 24 hours. In real-time: Variant A: 45% finished. Variant B: 62% completed the quiz. Variant B wins, so Sofia rolls off Variant A and keeps Variant B.

One day later, her teammate reports a typo. Sofia logs in, fixes it, re-tests in staging, and re-publishes. The fix goes live in 30 minutes. Sofia manages content with team backup, A/B tests efficacy, and iterates quickly. New content goes live in 24-48 hours.

**Failure & Recovery:** If staged content has a bug, Sofia rolls back to previous version and re-tests. If an approver is unavailable, a backup admin approves. If a published article has a typo, Sofia re-edits and re-publishes. If A/B test shows poor engagement, Sofia pauses the variant and analyzes.

**Capabilities Revealed:** Team roster with role assignments, approval workflow (Draft → Review → Staging → Live), backup admin coverage visibility, A/B testing and analytics dashboard, accessibility auto-validation, 24-48 hour time-to-production, content versioning and rollback, pre/post-publication editing.

---

### Journey 5: Support Staff (Marcus) - With Escalation & Knowledge Base

Marcus starts his shift and sees 15 open support tickets on his Support Dashboard. He has search (find account by child name or parent email), ticket queue (sorted by priority), knowledge base (curated solutions), and escalation path (route complex issues to engineering).

Ticket #1: "My son's streak reset and I don't know why." Marcus searches the Knowledge Base: "Streak Reset Causes" lists 5 common scenarios including cache cleared, disabled browser storage, account not linked, beta testing bug fixes, and sync failure. He checks account history and sees the kid is on iOS 2.2 (latest) with app cache cleared 2 hours ago. He responds with the solution: sign out, sign back in, streak syncs from servers (30 seconds). Parent replies 10 minutes later: "It worked! Thanks!" Ticket closed.

Ticket #2: "My daughter's account was hacked. Someone changed her password." Marcus sees this is a security issue and doesn't resolve it himself. He clicks "Escalate" and the ticket routes to his manager with full account history and device logs, flagged urgent. His manager takes it within 30 minutes.

Ticket #3: "How do I delete my child's account?" Marcus checks Knowledge Base: "COPPA: Account Deletion" with step-by-step instructions, including the 30-day waiting period and cancellation option. He responds with the steps. Parent confirms. Marcus processes the deletion in the admin system. Account is flagged for 30-day deletion with a note: "If you need to undo this within 30 days, contact us immediately."

Marcus resolves 10 of 15 tickets in 2 hours using the Knowledge Base. He escalates 3 complex tickets to appropriate teams. He leaves 2 in "waiting for customer response" status. His efficiency is high because the Knowledge Base prevents research time, escalation is clear, account history gives full context, and COPPA workflows are documented.

**Failure & Recovery:** If Marcus can't find the issue, he escalates to engineering immediately. If a customer disputes a solution, the ticket re-opens and escalates. If COPPA deletion fails, a safety mechanism alerts Marcus and escalates to engineering. If account recovery takes >48 hours, automatic escalation occurs.

**Capabilities Revealed:** Support Dashboard with account search and history timeline, curated Knowledge Base with common issue solutions, clear escalation path to engineering/security, COPPA compliance workflows automated, ticket triage (priority-based queue), bulk deletion workflows (30-day SLA with cancellation), device logs and sync history visible to support, ticket templates and issue categorization.

---

### Journey 6: Tester/QA (Priya) - With Test Plan & Load Testing

Priya is releasing Grid Logic (new game). The QA team has a structured test plan: Unit Testing (game logic—engineers own), Integration Testing (game connects to rewards, analytics, progression—Priya owns), E2E Testing (full user flows across devices), Load Testing (10,000 concurrent players), and Accessibility Testing (WCAG 2.1 AA).

Priya's E2E Test Plan:
- **Day 1: Desktop & Mobile (Happy Path)** — iOS Safari, Android Chrome, Desktop (Chrome, Firefox, Safari), Offline play with disconnect/reconnect
- **Day 2: Edge Cases** — Invalid moves, refresh mid-game, quit and resume, max difficulty, low battery mode
- **Day 3: Accessibility** — Keyboard navigation (100% of elements), screen reader (NVDA), color contrast (WCAG AA 4.5:1), font sizing (16px minimum)
- **Day 4: Load Testing** — Simulate 10,000 concurrent users. Benchmark: <200ms server latency. Result: 350ms at 10k users. Finding: Escalate to engineering for optimization. Engineering optimizes; Priya re-tests; <200ms achieved. Passed.
- **Day 5: Regression Testing** — Existing games, rewards system, parent reports, no new bugs

Priya finds one accessibility bug: Grid outline hard to see for color-blind users. She logs it. Engineering adds pattern overlay. Priya verifies the fix.

Grid Logic ships with zero critical bugs, 95%+ device parity, full WCAG AA compliance, load-tested at 10k concurrent users, and no regressions. Players don't experience crashes or accessibility barriers.

**Failure & Recovery:** If a bug is found post-launch, rollback to previous version, fix, test, re-release. If load testing fails, performance optimization required before release. If accessibility issues found, tester blocks release until fixed. If regression detected, previous version is compared to delta for cause analysis.

**Capabilities Revealed:** Structured test plan (Unit → Integration → E2E → Load → Accessibility), QA Dashboard with test checklists and coverage tracking, automated accessibility testing (color contrast, readability, keyboard navigation), load testing environment with concurrent user simulation, device lab for cross-platform testing, automated regression test suite, bug severity triage (critical, high, medium, low), production rollback procedure.

---

### Journey Requirements Summary

**From Child Journeys (Aiden & Maya):**
Chill Mode for neurodivergent/anxious kids, difficulty progression within games, hint system tied to badge types, world map with themed progression and boss puzzles, pause streaks during hiatuses, friend features optional/opt-in, robust reconnect/resume behavior with cloud sync recovery, progressive unlock system.

**From Parent Journey (James):**
Dual parent dashboards (Quick View vs. Full View), weekly reports optimized for 2-minute consumption, quarterly skill assessments with pre/post measurements, COPPA compliance documentation shown during setup, friend feature visibility controls, printable certificates, data deletion workflows (30-day SLA with cancellation).

**From Admin Journey (Sofia):**
Approval workflow (Draft → Review → Staging → Live), team roster with backup admin coverage visibility, A/B testing and engagement analytics, accessibility auto-validation (alt-text, reading level, file optimization), 24-48 hour time-to-production, content versioning and rollback, pre/post-publication editing.

**From Support Journey (Marcus):**
Support Dashboard with account search and history timeline, curated Knowledge Base with common issue solutions, clear escalation path to engineering/security, COPPA compliance workflows automated, ticket triage and categorization, bulk deletion workflows with 30-day SLA, device logs and sync history visible to support.

**From QA Journey (Priya):**
Structured test plan (Unit → Integration → E2E → Load → Accessibility), QA Dashboard with test checklists, automated accessibility testing (color contrast, keyboard navigation, screen readers), load testing environment with concurrent user simulation, device lab for cross-platform testing, automated regression suite, bug severity triage, production rollback procedure.
## Innovation & Novel Patterns

### Detected Innovation Areas

- **Process-First Reward System**
  - Little Thinkers rewards the child’s thinking process rather than just correct answers or completion.
  - Badges are earned for strategies like “creative reasoning,” “memory strategy,” and “pattern discovery,” not only for score or speed.
  - This shifts motivation from extrinsic points to intrinsic thinking growth.

- **Neurodivergent-First Product Identity**
  - Neurodivergent support is built into the core product, not tacked on as an accessibility add-on.
  - Features like Chill Mode, Focus Mode, dyslexia-friendly fonts, optional animations, and fine-motor adjustments are treated as first-class gameplay modes.
  - This positions the app as inclusive learning software, not just another educational game.

- **Combined Innovation Advantage**
  - The real innovation is the combination: a browser-friendly PWA + process-based rewards + neurodivergent-first learning modes.
  - That blend creates a novel product category between “educational game” and “inclusive cognitive learning platform.”

### Market Context & Competitive Landscape

- Most existing edtech products for kids (ABCmouse, Prodigy, Duolingo Kids) focus on:
  - completion metrics,
  - points and streak mechanics,
  - standard gamified progress.

- Little Thinkers differentiates by:
  - making rewards about thinking habits and problem-solving approach,
  - allowing streaks to pause instead of penalizing breaks,
  - treating accessibility modes as part of the core experience instead of optional settings.

- In the PWA/browser market, most competitors still treat education games as native-first experiences; Little Thinkers can stand out by delivering the same rich experience instantly in-browser with installability and seamless progress sync.

### Validation Approach

- Validate the innovation by testing these hypotheses:
  1. **Process rewards increase sustained engagement and perceived learning value** more than traditional score-based rewards.
  2. **Neurodivergent-first modes increase retention and satisfaction** for kids with ADHD, dyslexia, autism, and anxiety compared to standard educational games.

- Suggested validation methods:
  - A/B test Smart Mode with process badge framing vs. traditional achievement mode.
  - Conduct user interviews with neurodivergent kids and parents.
  - Measure qualitative outcomes like “felt less pressured” and “liked the game more.”
  - Track whether process-badge completion correlates with return rate better than raw scores.

- Success criteria for validation:
  - process-reward cohort retention > traditional reward cohort,
  - Chill/Focus mode users report lower stress and higher confidence,
  - at least 70% of kids understand badge meaning after the first session.

### Risk Mitigation

- Risk: process rewards may feel too abstract.
  - Mitigation: make badge criteria transparent with examples and short explanations in-app.
  - Add a “How this helps your brain” micro-tip for each process badge.

- Risk: neurodivergent features may feel overwhelming if presented all at once.
  - Mitigation: offer a simple onboarding flow that asks “How do you like to learn?” and recommends Chill or Focus modes.
  - Default new users into the most inclusive, lowest-pressure experience and let them explore upward.

- Risk: competitors may copy one feature quickly.
  - Mitigation: own the experience by combining process rewards, pause-not-reset streaks, and neurodivergent-first defaults in one coherent product identity.

- Fallback if innovation needs refinement:
  - keep a hybrid mode available with both score-based feedback and process-reward feedback,
  - surface process badges as a secondary “thinking progress” layer to preserve mainstream appeal.

### Additional Innovation Angles

- **Thinking Passport**
  - A progress map showing types of thinking skills practiced, not just levels completed.
  - Kids collect “mind stamps” for different cognitive strategies.

- **Accessibility Mode Coach**
  - A friendly guide that recommends Chill/Focus/Playful modes based on a short learning-style quiz.
  - Makes neurodivergent-friendly options easier to discover.

- **Process Reflection Moments**
  - After a puzzle, the app asks “How did you solve it?” and rewards strategy reflection.
  - This reinforces the process-reward model and helps kids internalize strategy.

- **Parent/Educator Signal**
  - Parent reports surface the child’s preferred thinking modes and accessibility settings.
  - This improves communication and validates the product’s inclusive approach.
## Domain-Specific Requirements (EdTech)

### Privacy & COPPA Compliance

**Data Collection & Minimization:**
- Collect only data necessary for core product functionality: gameplay data, progress tracking, skill assessments
- Do NOT collect: location data, device identifiers (IDFA/AAID), persistent tracking cookies
- Clear data collection consent shown during parent onboarding: "We collect gameplay data to track learning progress and personalize difficulty. We do not sell your data."
- Parents can request full data export at any time via "Data Export" function in Parent Zone

**Parental Consent & Controls:**
- Parental consent form shown during account creation (signed electronically); copy provided to parent
- Parent can enable/disable specific features: friend visibility, weekly reports, skill assessments
- Parent can access all data collected on their child at any time; granular control over data sharing
- Privacy & Data page prominently displayed: encryption, COPPA compliance, deletion rights, audit log retention

**Data Retention & Deletion:**
- Active accounts: Retain gameplay data indefinitely (child's lifetime achievement history)
- Inactive accounts (18 months without login): System sends parent email: "Your account has been inactive for 18 months. Click here to keep the account, or request deletion."
- If parent doesn't respond within 30 days of inactivity notice: Account flagged for deletion review
- Upon deletion request: All child data deleted within 30 days; backup systems purged within 60 days
- Audit log retained for legal compliance (5 years minimum)
- Deletion workflow automated in Support Dashboard; Marcus can process in <5 minutes

**Security & Data Protection:**
- End-to-end encryption for all user data in transit (HTTPS/TLS 1.2+)
- Encryption at rest for databases (AES-256 minimum)
- Annual third-party security audit with COPPA compliance verification; report shared with parents upon request
- Zero-knowledge architecture for parent account (parents can delete their account and data independently)
- No data shared with third parties except as required by law

---

### Content Moderation & Age-Appropriateness

**Pre-Publication Review Process:**
- All "Tell Me Why?" topics and stories undergo mandatory review before publishing
- Designated reviewers (educators, subject matter experts, child development specialists) assess:
  - Age-appropriateness for target age range (7+, 11+, 15+)
  - Factual accuracy and scientific/moral validity
  - Potential triggers or sensitive topics
  - Diversity, inclusion, and representation
- Content tagged with approval status: Approved, Needs Revision, Rejected
- Rejection reasons documented; content manager can revise and resubmit
- Approval workflow integrated into Admin Panel (Draft → Review → Staging → Live)

**Post-Publication Monitoring:**
- In-app reporting: Parents and kids can flag inappropriate content via "Report Content" button
- Flagged content routed to Moderation Dashboard with reason and timestamp
- Moderation team reviews within 48 hours
- If confirmed inappropriate: Content immediately hidden, marked "Under Review"
- Removal decision logged with reviewer name, timestamp, reason; analytics show reach (how many children saw it)
- Removed content archived (not deleted) for audit trail and legal compliance

**Appeals & Accountability:**
- Content manager notified of removal with moderation reason; can appeal with additional context
- All decisions logged with full audit trail (reviewer, timestamp, reason, appeal status)
- Monthly moderation report: content reviewed, flagged, removed, appeals accepted/denied
- Patterns tracked (e.g., bullying-related flags trigger deeper review process)
- Quarterly review of moderation decisions for consistency and bias detection

---

### Neurodivergent Accessibility & Inclusive Design

**Accessibility Features for Neurodivergent Learners:**
- **ADHD Support:** Chill Mode (no streaks, no time pressure, play at own pace); focus mode option (reduced UI distractions, larger tap targets, quiet sounds)
- **Dyslexia Support:** Dyslexia-friendly font option (OpenDyslexic or similar), high contrast mode, text-to-speech for all text content, adjustable font spacing
- **Autism Support:** Predictable UI patterns (consistent layouts across screens), no surprise animations unless opted in, clear navigation with breadcrumbs, option to disable social features entirely
- **Anxiety Support:** No public leaderboards (personal progress only), optional streak reminders (off by default), clear messaging on "no wrong answers," celebrations tied to thinking process not achievement
- **Fine Motor Challenges:** Adjustable tap target sizes (20px-48px configurable), game pause/resume (no time limits), one-handed mode for all games

**WCAG 2.1 AA+ Compliance:**
- All UI elements keyboard navigable (100%); Tab order logical and predictable
- Screen reader compatible (tested with NVDA, JAWS, VoiceOver); all images have descriptive alt-text
- Color contrast: 7:1 for all text and interactive elements (exceeds WCAG AA 4.5:1 minimum)
- Color-blind mode: Games use patterns and shapes, not color alone, for game logic; tetrachromat-friendly palette options
- Focus indicators: Clear, high-contrast focus rings (minimum 3px) on all interactive elements
- Adjustable text size: 16px-32px range, user-selectable in settings
- Accessible animations: All animations respect OS "Reduce Motion" setting; can be disabled globally in Accessibility settings
- Captions: All audio content (mascot reactions, game sounds) has visual alternatives or descriptions

**Neurodivergent Testing & Iteration:**
- Quarterly user testing with neurodivergent children and their parents/caregivers
- Feedback incorporated into quarterly releases
- Documentation: "Accessibility Guide for Parents" explaining all accessible features and how to enable them
- Accessibility audit by third-party firm annually

---

### Educational Alignment & Cognitive Skill Mapping

**Bloom's Taxonomy Mapping:**
Each game and content section mapped to Bloom's cognitive levels:
- **Remember:** Memory Flip (recall facts, memorization)
- **Understand:** Tell Me Why (comprehension of concepts, explanation)
- **Apply:** Word Pop, Pattern Builder (apply grammar/pattern rules to new situations)
- **Analyze:** Connection Quest (identify relationships, distinguish patterns)
- **Evaluate:** Grid Logic (make logical judgments, test validity)
- **Create:** (Reserved for future advanced games)

**Cognitive Skill Tracking:**
- Each game tracks specific cognitive domains:
  - **Memory:** Memory Flip (working memory, recall)
  - **Vocabulary & Language:** Word Pop (lexical knowledge, word relationships)
  - **Logic & Reasoning:** Connection Quest (deductive reasoning, pattern identification), Grid Logic (logical thinking, constraint satisfaction)
  - **Pattern Recognition:** Pattern Builder (visual-spatial patterns), Grid Logic (logic patterns)
  - **Curiosity & Knowledge:** Tell Me Why (scientific inquiry, knowledge acquisition)
  - **Social-Emotional Learning:** Story Time (empathy, moral reasoning, perspective-taking)
- Pre/post assessments measure improvement in each skill area (4-week intervals)
- Weekly reports show child's cognitive strengths and areas for growth with specific skill scores
- Skills mapped to international learning frameworks (Common Core, IB, NAEYC standards by region)

**Learning Objectives Alignment (MVP):**
- Each game explicitly aligned to learning objectives:
  - **Word Pop:** Language Arts (vocabulary development, phonetic awareness, word recognition)
  - **Connection Quest:** Critical Thinking (pattern recognition, relationship identification, analytical reasoning)
  - **Memory Flip:** Working Memory (short-term retention, recall accuracy, attention span)
  - **Pattern Builder:** Mathematics (spatial reasoning, sequential logic, geometric patterns)
  - **Grid Logic:** Logic & Problem Solving (constraint reasoning, hypothesis testing, systematic thinking)
  - **Tell Me Why:** Science & Curiosity (scientific inquiry, critical evaluation of information, knowledge building)
  - **Story Time:** Social-Emotional Learning (empathy, moral reasoning, cultural understanding)

**Parent Communication:**
- Weekly reports show: "Your child is developing skills aligned with [State/Region] Grade [X] standards in [Subject]"
- Quarterly assessments compare child's skill profile to age-matched peers (percentile, not name-based)
- Parent resources: "How to support your child's learning at home" with specific suggestions based on skill gaps

**Teacher Features (Future Roadmap, Post-MVP):**
- Optional teacher integration (post-MVP): Teachers can create class codes for progress tracking
- Teacher dashboard: Aggregate skill development across class, identify skill gaps
- Assignment capability: Teachers can assign specific games as homework or reinforcement
- Parent reports: Printable and shareable with classroom teachers
- Curriculum alignment: Teachers can filter games by curriculum standards

## PWA-Specific Requirements

### Project-Type Overview

Little Thinkers uses a **hybrid architecture**: a single-page application (SPA) for the interactive game experience (puzzle play, reward collection, progress tracking, network-resilient gameplay), combined with multi-page static/server-rendered content for public discovery and parent information (landing page, game info, privacy policy, terms, parent onboarding).

This hybrid model enables:
- Fast, interactive game SPA with network-resilient progress sync and reconnect handling
- SEO-friendly marketing and parent information pages
- Installable PWA that works across iOS Safari, Android Chrome, and desktop browsers
- Mobile-first optimization for touch-based gameplay on phones and tablets

### Browser & Platform Support Matrix

#### Launch Priority (Must Support)

| Platform | Browser | Version Requirement | Notes |
|----------|---------|-------------------|-------|
| iPhone | Safari | Latest 2 major iOS versions | Primary experience; optimize for iPhone 12+ screen sizes |
| iPad | Safari | Latest 2 major iPadOS versions | Tablet layout; responsive to portrait and landscape |
| Android Phone | Chrome | Latest 2 major Android versions | Primary experience; optimize for standard Android screen sizes |
| Android Tablet | Chrome | Latest 2 major Android versions | Tablet layout; responsive to portrait and landscape |

**Mobile Launch Gate:** All games, streaks, parent zone, and network resilience must be fully functional and optimized on these four platform/browser combinations before launch.

#### Secondary Support (Basic Functional)

| Platform | Browser | Version Requirement | Notes |
|----------|---------|-------------------|-------|
| Desktop/Laptop | Chrome | Latest 2 versions | Basic functional support; not optimized for mouse/keyboard interaction |
| Desktop/Laptop | Edge | Latest 2 versions | Basic functional support; uses Chromium engine |
| Desktop/Laptop | Safari | Latest 2 versions | Basic functional support; test for iOS-specific CSS/API differences |
| Desktop/Laptop | Firefox | Latest 2 versions | Basic functional support; test network resilience and sync reliability |

**Desktop Launch Gate:** All primary features must be playable and not crash, but UX optimization and performance tuning can follow post-launch.

#### Unsupported

- Internet Explorer (all versions)
- Older Android browsers (pre-Chrome standards)
- Browsers with no Service Worker support

### Responsive Design & Device Optimization

#### Mobile-First Design Principles

- **Primary Layout:** Portrait orientation optimized; landscape mode supported but not primary
- **Safe Area Support:** Respect iOS and Android safe-area insets for notches and system UI
- **Touch-First Interaction:** Minimum 44x44px tap targets (48px preferred); no hover-only interactions
- **Landscape Support:** Full playability in landscape for phones and tablets; streaming/leaderboard views rotate naturally
- **Tablet Optimization:** 
  - iPad in portrait and landscape both fully playable
  - Larger text, bigger button spacing compared to phone
  - Dual-pane layouts (e.g., parent zone: sidebar navigation + content) on tablet width (>800px)

#### Device-Specific Considerations

- **Notched iPhones:** Use safe-area CSS to prevent content overlap; game UI respects notch
- **One-Handed Play:** Controls positioned within thumb-reach zone on phone (lower half of screen)
- **Gesture Support:** Swipe gestures for game navigation; no complex multi-touch interactions for MVP
- **Orientation Changes:** App state persists during orientation change; no data loss

### Performance Targets & PWA Specifications

#### Core Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint (FCP) | < 2 seconds on 4G | Lighthouse 4G simulation |
| Largest Contentful Paint (LCP) | < 2.5 seconds on 4G | Lighthouse 4G simulation |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse measurement |
| Time to Interactive (TTI) | < 3 seconds on 4G | Lighthouse 4G simulation |
| Lighthouse Score | ≥ 85 mobile, ≥ 90 desktop | Lighthouse CLI |

#### Network Resilience

- **Service Worker:** Caching strategy for app shell (HTML, CSS, JS, critical assets) with stale-while-revalidate
- **Reconnect Resilience:** Brief network interruptions are detected and the current session resumes without data loss
- **Local Save:** Small amounts of state are kept locally to preserve interrupted gameplay until reconnect
- **Offline Mode:** Not part of MVP launch; full offline play and offline-first sync are planned for Phase 2
- **UI Indicators:** Clear messaging when connection is lost and when sync resumes

#### App Installation & Manifest

- **Web App Manifest:** Defines app name, icon (192x192, 512x512), colors, orientation (portrait-primary)
- **Install Prompt:** Appears after 2-3 game sessions; "Add to Home Screen" on iOS (manual), automated install prompt on Android
- **Installed App Behavior:** 
  - Standalone mode (full-screen, no browser chrome)
  - Custom app icon on home screen
  - Splash screen with brand colors while app loads
  - Launch in fullscreen without URL bar

#### Progressive Enhancement

- **No-JavaScript Fallback:** Static landing page and parent info pages render without JavaScript
- **Basic Game Fallback:** If JavaScript fails mid-session, progress saved locally; user can retry
- **Graceful Degradation:** Missing localStorage → all play is online-only; no offline cache

### SEO Strategy & Public Pages

#### SEO-Required Pages

The following pages must be SEO-optimized with metadata, structured data, and social sharing preview:

1. **Landing Page** (`/`)
   - Title: "Little Thinkers - Brain Games for Kids 7-15"
   - Meta description: "Enhance your child's memory, logic, and problem-solving with brain games designed by educators"
   - Structured data: Organization schema, BreadcrumbList
   - Open Graph: Image (1200x630), title, description for social sharing

2. **Game Category Page** (`/games`)
   - Title: "Brain Games - Improve Memory, Logic & Problem-Solving"
   - Meta description: Per-game cards with descriptions
   - Structured data: Game schema (name, description, genre, image)
   - Images: 1200x630 for each game card

3. **Parent Information** (`/parent-info`)
   - Title: "Parent Resources - Little Thinkers Learning Platform"
   - Meta description: "Track your child's learning progress, view reports, and understand how brain games improve cognitive skills"
   - Structured data: FAQ schema for common parent questions

4. **Privacy & Safety** (`/privacy`)
   - Title: "Privacy & Safety - Little Thinkers"
   - Meta description: "COPPA-compliant. We protect your child's data. Full details on privacy, data retention, and security"
   - H1: "How We Protect Your Child's Data"

5. **About Page** (`/about`)
   - Title: "About Little Thinkers"
   - Meta description: "Mission-driven edtech for cognitive development. Built with educators and child development experts"

#### Non-SEO Pages (SPA Routing)

The following are SPA routes within the game experience and do NOT require SEO optimization:

- `/play` — Game selection and play screen
- `/progress` — Child progress dashboard
- `/parent-zone` — Parent reports and settings
- `/settings` — App settings and accessibility options
- `/help` — In-app help and FAQ
- `/achievements` — Badge and streak view

These routes are deep-linked for PWA functionality (bookmarking, direct share) but not indexed by search engines.

#### Technical SEO

- **Robots.txt:** Index landing, games, parent-info, privacy, about pages; disallow `/play`, `/progress`, `/parent-zone`
- **Sitemap.xml:** Include only public pages; refresh weekly
- **Canonical Tags:** Prevent duplicate content issues
- **Mobile-Friendly:** Responsive design passes Google Mobile-Friendly Test
- **Core Web Vitals:** All pages meet "Good" threshold on PageSpeed Insights
- **Structured Data:** JSON-LD schema for Organization, Game, FAQPage, and other relevant types

### Accessibility & Platform-Specific Considerations

#### Platform-Specific Accessibility Features

**iOS Safari + VoiceOver:**
- All buttons and interactive elements have accessible labels
- Screen reader announces game names, scores, and reward badges
- Gestures remappable to simple tap + swipe for accessibility users
- Safe-area padding prevents hidden content behind notches

**Android Chrome + TalkBack:**
- All buttons and interactive elements have accessible labels (content descriptions)
- Screen reader announces game names, scores, and rewards
- Complex gestures have keyboard alternatives
- Touch exploration and focus navigation both work
- Vibration feedback togglable (not default)

#### Touch Target & Interaction Design

- **Minimum Tap Target Size:** 44x44 px (Apple guideline), 48x48 px preferred
- **Spacing Between Targets:** 8px minimum to prevent accidental taps
- **Gesture Support:** Swipe for navigation; single tap for selection; long-press for context menus (with tap alternative)
- **No Hover-Only Controls:** All functionality accessible without hover; critical for touch devices

#### Reduced-Motion & Animation

- **Respects Prefers-Reduced-Motion:** All animations disabled if OS setting enabled
- **Default Animations:** Subtle (200-300ms), not disorienting
- **Disable Animations Toggle:** Settings page includes explicit "Disable All Animations" option

#### Color & Non-Color Feedback

- **Color-Blind Modes:** High-contrast mode, monochrome mode, deuteranopia-friendly palette
- **Non-Color Feedback:** Shapes, patterns, text labels reinforce color coding in games
- **Icon Usage:** Icons paired with text labels; not icon-only buttons
- **Focus Indicators:** Clear, high-contrast focus rings on all interactive elements (3px minimum)

#### Readable Text

- **Font Sizing:** 16px base size for body text; 44px+ for game titles
- **User-Adjustable:** Settings allow 80%-120% text zoom
- **Dyslexia Support:** OpenDyslexic or similar font option
- **Line Height:** 1.5 minimum; increased in accessibility mode
- **Text Contrast:** 7:1 for all text and controls (exceeds WCAG AA standard)

#### Safe-Area & System UI Integration

- **Safe Area Insets:** App respects notches, home indicators, and dynamic islands on iOS
- **Status Bar:** Background color matches app for seamless integration
- **Fullscreen Toggle:** Users can choose between fullscreen (app) and windowed (browser) display
- **Home Indicator Padding:** Content does not sit directly above home indicator; 20px bottom padding minimum

#### Keyboard Navigation & One-Handed Play

- **100% Keyboard Navigable:** Tab order follows reading order; Enter/Space to activate; Arrow keys to navigate lists
- **One-Handed Mode:** Optional layout that moves all controls to lower half of screen; game board scales accordingly
- **External Keyboard Support:** Full keyboard support for iPad + external keyboard scenarios

### Implementation Considerations

#### Technology Stack Implications

- **Framework:** React or similar SPA framework for game experience; Next.js or similar for static pages
- **Network-Required Architecture with reconnect resilience:**
  - Service Worker with cache-first strategy for app shell
  - IndexedDB or similar for local game state persistence for reconnect resilience
  - Sync engine for background data sync on reconnection
- **Build & Deployment:**
  - Separate builds for SPA and static pages or unified build with routing split
  - Automated performance testing on every deploy (Lighthouse CI)
  - Rollback capability for PWA updates (versioning in Service Worker)

#### Cross-Platform Testing

- **Device Testing Lab:** iOS devices (iPhone SE, iPhone 13+, iPad), Android devices (Pixel, Samsung) across OS versions
- **Browser Testing:** BrowserStack or similar for Safari, Chrome, Firefox, Edge versions
- **Performance Testing:** Load testing on 4G and 3G networks; reconnect and sync stress testing
- **Accessibility Testing:** Manual testing with VoiceOver and TalkBack; automated WCAG scanning

#### PWA-Specific Challenges

- **iOS PWA Limitations:** No background sync, limited Service Worker support; requires alternative sync strategy (periodic sync on app foreground)
- **Cookie & Storage:** Limited localStorage on iOS PWA (partition per domain); use IndexedDB for larger data
- **Updates:** PWA updates via Service Worker; users may not immediately see new version; communicate update availability in-app
- **Attribution:** PWA installs not tracked in app stores; use in-app analytics to track install source and engagement

#### Deployment Pipeline

- **Staging:** Full PWA available at staging domain; includes install prompt and reconnect tests
- **Pre-Canary Smoke Tests:** 30 minutes before production push, synthetic tests run on staging (game load, sync trigger, reconnect verification); any failure blocks push
- **Canary:** 5% of users on new PWA version; monitor for crashes and sync failures
  - Duration: 2 hours minimum, 6 hours recommended
  - Automatic rollback if error rate >2% for 15 minutes OR sync success rate <95% for 10 minutes
  - Metrics monitored: Error rate, sync success rate, Lighthouse performance, CLS (layout shift)
- **Rolling Production:** 20% → 50% → 100% deployment over 3 days; quick rollback available
  - Each tier: 1–3 hour soak period before proceeding to next tier
  - Block rollout if any metric degradation detected
- **iOS PWA Deployment:** 
  - Track iOS version and PWA cache state separately
  - iOS users may not receive Service Worker update immediately (Apple's caching)
  - In-app version indicator and "New version available, tap to refresh" banner
  - Emergency cache clear available in Settings
  - Alert if <10% of iOS PWA users are on latest version after 48 hours
- **Monitoring & Alerts:** 
  - Service Worker update failures, sync errors, connectivity issues tracked hourly
  - Real-time dashboards: Error rate, sync success rate, Lighthouse scores
  - Daily: User growth, sync health, feature adoption
  - Weekly: Retention cohort analysis, performance trends by OS version

#### Risk Mitigation & Enhanced PWA Requirements

##### Phase 2 Offline Architecture Notes

**Phase 2 Focus:** Offline play and offline-first sync are not part of MVP launch. These capabilities are planned for post-launch development and will be validated in Phase 2.

**Phase 2 Targets:**
- Local cache and reconnect sync for full offline play
- Conflict resolution rules for leaderboard scores, settings, achievements, and streaks
- IndexedDB quota management and graceful degradation for offline storage
- Reconnect validation and retry strategies for sync reliability

##### Browser Support & Platform Edge Cases

**iOS PWA Specific:**
- Cache clears on iOS major version upgrades; version-aware IndexedDB snapshots saved to cloud at session end
- On-device backup to localStorage for ≤1MB critical data
- Offline performance: works ≤7 days; week-long offline sync tested to 30-second reconnect window
- VoiceOver + game canvas: semantic labels for all controls; game state announced; canvas describes state without giving away solution

**Android Vendor Inconsistency:**
- Background sync works on >90% Android Chrome but fails on Samsung Internet, Huawei Browser (15-20% of Asian market)
- Mitigation: Graceful degradation for non-Chrome browsers; manual sync fallback
- Monitor real-world sync success rates by user agent

**Notch & Safe-Area Edge Cases:**
- Safe-area CSS works on flagship devices; causes layout breaks on budget Android phones (Redmi, realme)
- Real device testing on BrowserStack: Samsung Galaxy A13 (budget, notch issues), iPhone SE (small notch), iPhone Pro Max (large safe area)
- iPad landscape: 44px targets near notch area tested for collision issues

**Network Detection & Metered Connections:**
- Metered connections (school WiFi, slow 3G) may fail Service Worker fetch, triggering connection-loss mode unexpectedly
- Kids see stale leaderboards, broken features if connection state is misdetected
- Implement connection state monitoring with 3-second debounce to prevent false network state transitions

**PWA Installation:**
- iOS: Manual Share → Add to Home Screen (5 taps); ~40% of first-time users don't discover install
- Android: Native Install Prompt + Add to Home Screen fallback
- Mitigation: In-app banner after 2-3 game sessions; education during parent onboarding about PWA benefits

##### Performance & Accessibility Integration

**Performance Targets (Real-World 4G):**
- First Contentful Paint (FCP): <2s via critical CSS inline, non-critical JS deferred
- Largest Contentful Paint (LCP): <2.5s; challenge: canvas rendering + splash image; mitigation: hero image <80KB (WebP), canvas render on next frame post-LCP
- Cumulative Layout Shift (CLS): <0.1; safe-area reserves space, no layout thrashing on orientation change
- **Risk:** Particle effects or AI during LCP window can spike to 3.5s; requires code splitting

**Lighthouse Targets:**
- Mobile: ≥85 (Performance 85, Accessibility 100, Best Practices 92, SEO 100)
- Desktop: ≥90
- Re-run Lighthouse on every deploy; block rollout if regression >5 points
- Achievable via: game canvas off-main-thread (Web Worker), server-side render home page, aggressive caching

**Accessibility Regression Testing:**
- Run automated accessibility checks (Axe DevTools) on every deploy
- Manual testing with screen readers (VoiceOver, TalkBack) weekly
- Real user feedback from neurodivergent cohort: bi-weekly survey, incident reports tracked

**Neurodivergent Accessibility Testing (MVP):**

*Intersectional Testing Cohorts* (6-12 real users, 2-3 per cohort):
1. ADHD + Vestibular (motion-induced nausea) → test pausability, reduced-motion combo
2. ADHD + Deuteranopia (red-green color blind) → test color mode in isolation + all features on
3. Dyslexia + Reduced Attention Span → test font options + pausability
4. Autism + Sound Sensitivity → test audio muting, vibration options

*Test Scenarios:*
- Scenario 1: ADHD user, reduced-motion on, color-blind mode, plays for 30 min with 5 task switches → expect no frustration, distinguishable colors, no vestibular issues
- Scenario 2: Dyslexic user, OpenDyslexic font, 1.5x letter-spacing, VoiceOver on → expect all text readable, VoiceOver pronunciation correct
- Scenario 3: All accessibility features on simultaneously (max load) → expect <3s LCP, no lag during keyboard nav, no accessibility API conflicts

*Sign-Off Criteria:*
- All cohorts complete 2+ game sessions without frustration (subjective + timing data)
- Zero critical accessibility violations (Axe scan)
- 100% keyboard navigable (eyes-closed, keyboard-only test)
- At least 2 neurodivergent users approve final product before launch

*Timeline:* Recruitment 3-4 weeks, testing 2-3 weeks, iteration 1-2 weeks; total 6-8 weeks. **Must start now** (parallel with development) or will miss MVP window.

##### Device Linking & Offline Progress Recovery

**Gap Addressed:** PRD did not specify what happens when a child reinstalls on a new device.

**Device Linking Requirement:**
- Child account linked to parent email; reinstalling app recovers all local and cloud progress
- Login during reinstall prompts parent email verification (COPPA compliance)
- New device syncs all historical progress within 60 seconds of login
- Offline data from old device is NOT lost if app uninstalled; data recoverable on any device via login

**User Story:**
- Parent buys new iPad for child; child logs into Little Thinkers app with same parent account
- App auto-syncs child's full progress history (scores, streaks, achievements, world map progress)
- Child can continue playing without data loss or confusion

**Technical Implementation:**
- Parent email = account identifier
- Child profile linked to parent email (multiple children supported)
- Cloud storage of all progress; local IndexedDB mirrors cloud on each device
- Login recovery: fetch cloud data, merge with any local offline data, deduplicate

## Project Scoping: Single Release Strategy

### Scope Philosophy

**Approach:** Comprehensive feature launch positioning Little Thinkers as a fully-featured cognitive learning platform from day one. All core components (5 games, reward system, parent zone, neurodivergent accessibility, PWA infrastructure) are interdependent and required for the product vision.

### Complete Feature Set at Launch

**Games & Content:**
- 5 core games: Word Pop, Connection Quest, Memory Flip, Pattern Builder, Grid Logic
- Puzzle of the Day (daily engagement feature)
- Tell Me Why (science curiosity topics with educator review)
- Story Time (short moral stories with educator review)

**Reward System:**
- Brain Jar (Thought Sparks accumulation)
- Process-based Thinker Badges (thinking strategy rewards)
- World Map Progression (5 themed areas)
- Daily Thinking Streaks (pause-not-reset model)
- Mascot Evolution (accessories and levels)

**Parent Zone:**
- Quick View & Full View dashboards
- Weekly Brain Reports
- Quarterly Pre/Post Assessments
- COPPA Compliance (consent, data export, 30-day deletion)
- Friend feature controls
- Printable certificates

**Accessibility (MVP Scope):**
- WCAG 2.1 AA compliance (100% keyboard navigable, screen reader compatible, 7:1 contrast)
- Neurodivergent-first modes: Chill Mode, Focus Mode, dyslexia fonts, reduced motion, color-blind modes
- Vestibular-safe gameplay (no spinning/disorienting mechanics as default)
- ADHD testing (pausable gameplay, task-switching support)

**PWA Infrastructure:**
- PWA installable on iOS and Android (home screen icon, fullscreen mode, splash screen)
- Cross-platform support (iOS Safari, Android Chrome, desktop)
- Fast loading and responsive design
- Network-required gameplay (offline capability deferred to post-launch)

**Offline Play Capability:**
- **Moved to post-launch roadmap** (Phase 2+). MVP focuses on network-dependent gameplay with instant cloud sync.
- Post-launch offline roadmap: local cache, offline-first sync, device linking for reinstall recovery

**Admin & Support:**
- Content approval workflow (Draft → Review → Staging → Live)
- Support Dashboard with COPPA workflows
- Accessibility auto-validation
- Production monitoring (sync health, offline metrics)

### Timeline & Feasibility Analysis

**Critical Path Analysis (Without Offline MVP):**
- 5 game builds: 6-7 weeks (parallel; game 5 lowest priority)
- Accessibility testing: 7 weeks (discovery-driven, cannot compress without quality loss)
- PWA + performance: 5 weeks (simpler without offline sync architecture)
- Parent zone + reporting: 4 weeks
- iOS/Android cross-platform validation: 2-3 weeks
- **Total critical path: ~10 weeks minimum**

**Revised Realistic Timeline by Scope:**

| Scope | Timeline | Team | Confidence | Trade-offs |
|-------|----------|------|-----------|-----------|
| **Full (all features listed, no offline MVP)** | 11-12 weeks | 6-8 | 85% | No cuts. Full accessibility testing. Network-required play. |
| **Core (5 games, dashboard parent zone, WCAG AA + vestibular MVP)** | 10 weeks | 6-8 | 85% | Defer: game 5, email digests, cosmetics, ADHD+colorblind combos. Network-required play. |
| **Essential (4 games, basic features, WCAG AA)** | 8 weeks | 6+ | 70% | Cut game 5 and advanced features. Network-required play. Still achievable with quality. |

**Recommended Strategy (Revised - Without Offline MVP):**
- **Timeline: 10 weeks**
- **Scope: Core** (5 games, dashboard parent zone, WCAG AA + vestibular + ADHD testing, network-required play)
- **Team: 6-8 people** (same composition, but reduced backend complexity)

**De-Scope Ladder (If Pressure Increases):**
- **Week 6:** Defer game 5, email digests (-2.5 weeks) → timeline becomes 7.5 weeks
- **Week 7:** Simplify cosmetics, defer ADHD+colorblind testing (-1.5 weeks) → timeline becomes 6 weeks
- **Total contingency pool:** ~5 weeks of deferrable features (even without offline MVP)

### Launch Readiness Criteria

**Critical Success Factors (Non-Negotiable):**
1. Week 1: Accessibility specialist embedded (not joined week 8)
2. Week 1: Game engine and rendering pipeline locked (performance critical)
3. Week 3: Neurodivergent cohorts recruited and testing begins
4. Weeks 9-10: Scope discipline—no feature creep

**Weekly Go/No-Go Decision Gates:**

**Week 1 - Architecture Review:**
- Game engine architecture approved (performance targets locked for Lighthouse 85+)
- API + parent zone data models designed
- Go: YES → proceed | NO → add 1-2 weeks to timeline or revisit scope

**Week 4 - Game 1 Complete:**
- Game 1 playable, Lighthouse ≥80 mobile
- Accessibility audit finds <5 major gaps
- Go: YES → full pipeline | CAUTION → add 1 week optimization | NO → slip 1 week or cut game 5

**Week 7 - Integration Complete:**
- All 5 games integrated, syncing to cloud reliably
- Accessibility testing reveals no game-mechanic blockers
- Go: YES → final sprint | CAUTION → defer cosmetics/email | NO → slip 1 week or cut game 5

**Week 9 - Final Scope Lock:**
- iOS PWA validated (iOS 14-17, responsive works)
- Cross-platform testing complete (iOS, Android, desktop)
- Accessibility sign-off from neurodivergent cohorts
- Go: YES → staging rollout | CAUTION → have rollback ready | NO → delay 1 week

**Launch Gate (Final Validation):**
- Error rate <0.5% in 24-hour staging soak
- Sync to cloud success rate >99% (all game saves persisting)
- Lighthouse ≥85 mobile, ≥90 desktop (final audit)
- Neurodivergent cohorts: 100% approval
- Zero critical WCAG violations
- Device testing: iOS/Android/desktop functional

## Functional Requirements

### Game Experience

- FR1: Child can sign in and select their linked child profile to access their own game progress and rewards
- FR2: Child can select and play any of five games (Word Pop, Connection Quest, Memory Flip, Pattern Builder, Grid Logic)
- FR3: Child can choose difficulty level and view game instructions before gameplay begins
- FR4: Child can pause and resume gameplay within a session
- FR5: Child receives immediate feedback on correct and incorrect answers during gameplay
- FR6: Child can resume an interrupted game from the last saved state after navigating away or facing a session interruption
- FR7: Child can access Puzzle of the Day, Tell Me Why topics, and Story Time stories from the app home experience
- FR8: Child can browse available content by topic and age-appropriateness indicators

### Reward & Progress

- FR9: Child earns Thought Sparks for correct answers and progress milestones
- FR10: Child accumulates Thought Sparks into a Brain Jar progress indicator
- FR11: Child earns process-based Thinker Badges for applying thinking strategies, not just for completion
- FR12: System can award multiple badges in the same session and preserve earned reward state even if cloud sync retries are required
- FR13: Child can view earned badges with explanations of why they were awarded
- FR14: Child can see and interact with a world map showing five themed areas and their unlocked progress
- FR15: Child unlocks world map areas by achieving curriculum-aligned milestones across games and content
- FR16: Child builds a mascot that evolves through gameplay and earns new accessories through progression
- FR17: Child maintains a daily thinking streak that pauses during defined breaks and does not reset unfairly for short hiatuses

### Accessibility & Personalization

- FR18: Child can choose Smart, Chill, or Focus mode for gameplay and learning experiences
- FR19: Child can toggle Reduced Motion, color-blind modes, dyslexia-friendly font, text size, and one-handed layout
- FR20: Child can persist gameplay and accessibility preferences across sessions
- FR21: All gameplay and content functions are fully keyboard accessible
- FR22: All interactive content is compatible with screen readers (VoiceOver and TalkBack)
- FR23: Reward, progress, and navigation notifications have accessible equivalents for screen reader and keyboard users

### Parent Zone

- FR24: Parent can create an account and link one or more child profiles
- FR25: Parent provides COPPA consent during signup and can withdraw or update consent preferences for each linked child
- FR26: Parent can access a Quick View dashboard with a concise weekly progress summary
- FR27: Parent can access a Full View dashboard with detailed skill tracking, world map progress, streak status, and assessments
- FR28: Parent receives weekly Brain Reports and can view quarterly pre/post cognitive skill assessments
- FR29: Parent can export a complete child data report, including progress, badges, assessments, and activity history
- FR30: Parent can request account deletion with a 30-day SLA and review deletion status
- FR31: Parent can manage friend feature visibility and child profile settings
- FR32: Parent can print achievement certificates for the child
- FR33: Parent can view the child's active accessibility settings and learning preferences
- FR34: Parent can configure report cadence and detail level during onboarding and later from settings
- FR35: Parent can recover a forgotten password using secure email verification

### Cloud Sync & Data Management

- FR36: All game progress syncs to the cloud immediately after completion when connected
- FR37: Child progress persists across device sign-ins and reinstalls
- FR38: Multiple children can be linked to a single parent account with separate progress records
- FR39: All sensitive data is encrypted in transit and at rest
- FR40: Parent and child can view sync status and receive clear failure notifications when sync does not complete
- FR41: System retries cloud sync and preserves progress if immediate sync is delayed
- FR42: System captures audit logs for consent, content review, deletion, and support actions

### Content & Curriculum

- FR43: Content manager can create and submit Tell Me Why and Story Time content for review
- FR44: Reviewer can approve, request revision, or reject submitted content
- FR45: Approved content moves through a staging-to-live workflow
- FR46: Content manager can tag educational content by cognitive skill domain for analytics and curriculum alignment
- FR47: Content manager can A/B test content variants and track engagement metrics
- FR48: System validates published content for accessibility, age-appropriateness, and educator review status

### Admin & Support

- FR49: Parent can access Help and FAQ content from within the app
- FR50: Support staff can search for accounts by parent email or child name
- FR51: Support staff can view account history, linked child relationships, and activity timelines
- FR52: Support staff can process COPPA deletion requests with an automated workflow
- FR53: Support staff can escalate issues to engineering when needed
- FR54: Support interactions are logged for compliance and audit

### Platform & Installability

- FR55: The app is installable as a PWA on iOS
- FR56: The app is installable as a PWA on Android
- FR57: The installed app displays as a standalone experience without browser chrome
- FR58: The app shows a branded splash screen while loading
- FR59: The app works in portrait and landscape orientations
- FR60: The app respects safe area insets for notches and home indicators
- FR61: The app supports responsive layouts across mobile, tablet, and desktop browsers

## Non-Functional Requirements

### Performance

- NFR1: Home screen and core game pages render first content within 2 seconds on a 4G mobile connection
- NFR2: In-app navigation and game screen transitions complete within 1.5 seconds after user input
- NFR3: Core gameplay interactions respond within 100 milliseconds on supported devices
- NFR4: PWA install and cold start complete within 3 seconds on modern mobile hardware
- NFR5: Lighthouse performance score remains ≥85 on mobile and ≥90 on desktop for production releases

### Security & Privacy

- NFR6: All user data is encrypted in transit using HTTPS/TLS and encrypted at rest using industry-standard algorithms
- NFR7: Parent and child authentication sessions use secure access tokens and expire after a configurable inactivity period
- NFR8: The product stores only the minimum personally identifiable information required for COPPA compliance
- NFR9: Parent consent and deletion requests are logged and fulfilled within the 30-day SLA
- NFR10: The system undergoes a third-party security audit before launch and remediates all critical vulnerabilities prior to production deployment

### Scalability & Reliability

- NFR11: Backend services support at least 3x anticipated launch traffic without more than 10% degradation in user-facing response times
- NFR12: Core game sync services maintain ≥99% success rate for save and progress sync operations
- NFR13: Production availability for the app's core workflows is at least 99.5% over a 30-day rolling window
- NFR14: Monitoring and alerting detect and notify the team of sync failures, accessibility regressions, and critical errors within 10 minutes
- NFR15: Data deletion, consent, and audit logs are retained for at least 5 years to support COPPA compliance requirements

### Accessibility

- NFR16: The app meets WCAG 2.1 AA requirements for all published screens and gameplay flows
- NFR17: Keyboard navigation is supported for 100% of interactive game and Parent Zone elements
- NFR18: Screen reader compatibility is verified for core game workflows, content sections, and parent reports
- NFR19: Accessibility settings (mode, font, color contrast, motion, layout) persist across sessions and devices

### Integration

- NFR20: External services for email reports, analytics, and content review integrate securely with audited API connections
- NFR21: Third-party integrations are designed to fail gracefully and do not block core gameplay when temporarily unavailable

### Quality & Maintainability

- NFR22: Builds include automated Lighthouse, accessibility, and regression checks in the CI pipeline
- NFR23: Deployments include feature flags for major capabilities and automatic rollback on failure conditions

### AI Integration Note

- AI-driven features are treated as functional capabilities when they define user-facing behavior.
- Quality attributes of AI systems—such as latency, reliability, and privacy—belong in non-functional requirements when they are part of the product's technical quality contract.

### Post-Launch Roadmap (Deferred Features)

**Phase 1 Hotfixes (Weeks 1-2):**
- Critical bug fixes discovered during launch
- ADHD+colorblind accessibility refinements

**Phase 2 (Weeks 3-4 Post-Launch):**
- Game 5 release (Logic Puzzle)
- Email digest system for parents
- Basic cosmetics (mascot accessories)

**Phase 3 (Months 2-3):**
- **Offline Play Capability** (local caching, offline-first architecture, device linking)
- Advanced parent analytics (engagement trends, skill gaps)
- Teacher integration (class codes, aggregate dashboards)
- Challenge mode with difficulty tiers
- Optional peer leaderboards (with parental controls)

**Phase 4+ (Month 4+):**
- Additional content expansion (Tell Me Why, Story Time library growth)
- International language support
- School district licensing and bulk management
- Advanced personalization and adaptive difficulty

##### Launch Readiness Criteria (Consolidated)

**Must-Have Before Launch:**
- ✅ Cloud sync for all game saves and progress (instant, >99% reliability)
- ✅ iOS version tracking and cache management strategy documented and implemented
- ✅ WCAG 2.1 AA compliance: 100% keyboard navigable, screen reader compatible, 7:1 contrast, color-blind modes
- ✅ COPPA compliance: parental consent, data minimization, 30-day deletion SLA
- ✅ Network-required gameplay: clear user education that internet connection needed
- ✅ Cross-platform validation: iOS Safari, Android Chrome, desktop browsers functional

**Should-Have for MVP (Strongly Recommended):**
- ✅ Pre-launch smoke tests + automatic rollback on metric breach (deploys with confidence)
- ✅ Intersectional neurodivergent testing cohorts (3-4 combos): ADHD + vestibular, ADHD + color blind, dyslexia + attention, autism + sound sensitivity
- ✅ Cloud sync deterministic test scenarios (data save, retrieval, conflict handling)
- ✅ Parent-child progress sync full e2e test coverage
- ✅ Real device testing: iOS (SE, 13+, iPad), Android (Pixel, Galaxy, budget phones), Desktop (Chrome, Safari, Firefox)
- ✅ Lighthouse CI in deployment pipeline; block rollout if regression >5 points
- ✅ iOS PWA version tracking and in-app refresh prompts

**Post-Launch (First Phase 2 Hotfix Cycle):**
- Offline play architecture (local cache, conflict resolution, device linking)
- Advanced monitoring dashboards for sync success, gameplay metrics, accessibility adoption
- Feature flags for major features (leaderboard, friend sync, premium content)

**Not-Addressable at Launch (Accept Known Limits):**
- Real-time multiplayer or leaderboard sync on high-latency networks (accept eventual consistency ~5-10 sec)
- Full coverage of all device/browser combinations (test statistically significant subset, fix regressions post-launch)
- Intersectional testing of all disability combinations (test high-risk combos in MVP, expand post-launch)
- Offline play capability (move to Phase 2)
