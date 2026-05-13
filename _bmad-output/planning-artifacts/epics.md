---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments: ["_bmad-output/planning-artifacts/prd.md"]
---

# little-thinkers - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for little-thinkers, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Child can sign in and select their linked child profile to access their own game progress and rewards
FR2: Child can select and play any of five games (Word Pop, Connection Quest, Memory Flip, Pattern Builder, Grid Logic)
FR3: Child can choose difficulty level and view game instructions before gameplay begins
FR4: Child can pause and resume gameplay within a session
FR5: Child receives immediate feedback on correct and incorrect answers during gameplay
FR6: Child can resume an interrupted game from the last saved state after navigating away or facing a session interruption
FR7: Child can access Puzzle of the Day, Tell Me Why topics, and Story Time stories from the app home experience
FR8: Child can browse available content by topic and age-appropriateness indicators
FR9: Child earns Thought Sparks for correct answers and progress milestones
FR10: Child accumulates Thought Sparks into a Brain Jar progress indicator
FR11: Child earns process-based Thinker Badges for applying thinking strategies, not just for completion
FR12: System can award multiple badges in the same session and preserve earned reward state even if cloud sync retries are required
FR13: Child can view earned badges with explanations of why they were awarded
FR14: Child can see and interact with a world map showing five themed areas and their unlocked progress
FR15: Child unlocks world map areas by achieving curriculum-aligned milestones across games and content
FR16: Child builds a mascot that evolves through gameplay and earns new accessories through progression
FR17: Child maintains a daily thinking streak that pauses during defined breaks and does not reset unfairly for short hiatuses
FR18: Child can choose Smart, Chill, or Focus mode for gameplay and learning experiences
FR19: Child can toggle Reduced Motion, color-blind modes, dyslexia-friendly font, text size, and one-handed layout
FR20: Child can persist gameplay and accessibility preferences across sessions
FR21: All gameplay and content functions are fully keyboard accessible
FR22: All interactive content is compatible with screen readers (VoiceOver and TalkBack)
FR23: Reward, progress, and navigation notifications have accessible equivalents for screen reader and keyboard users
FR24: Parent can create an account and link one or more child profiles
FR25: Parent provides COPPA consent during signup and can withdraw or update consent preferences for each linked child
FR26: Parent can access a Quick View dashboard with a concise weekly progress summary
FR27: Parent can access a Full View dashboard with detailed skill tracking, world map progress, streak status, and assessments
FR28: Parent receives weekly Brain Reports and can view quarterly pre/post cognitive skill assessments
FR29: Parent can export a complete child data report, including progress, badges, assessments, and activity history
FR30: Parent can request account deletion with a 30-day SLA and review deletion status
FR31: Parent can manage friend feature visibility and child profile settings
FR32: Parent can print achievement certificates for the child
FR33: Parent can view the child's active accessibility settings and learning preferences
FR34: Parent can configure report cadence and detail level during onboarding and later from settings
FR35: Parent can recover a forgotten password using secure email verification
FR36: All game progress syncs to the cloud immediately after completion when connected
FR37: Child progress persists across device sign-ins and reinstalls
FR38: Multiple children can be linked to a single parent account with separate progress records
FR39: All sensitive data is encrypted in transit and at rest
FR40: Parent and child can view sync status and receive clear failure notifications when sync does not complete
FR41: System retries cloud sync and preserves progress if immediate sync is delayed
FR42: System captures audit logs for consent, content review, deletion, and support actions
FR43: Content manager can create and submit Tell Me Why and Story Time content for review
FR44: Reviewer can approve, request revision, or reject submitted content
FR45: Approved content moves through a staging-to-live workflow
FR46: Content manager can tag educational content by cognitive skill domain for analytics and curriculum alignment
FR47: Content manager can A/B test content variants and track engagement metrics
FR48: System validates published content for accessibility, age-appropriateness, and educator review status
FR49: Parent can access Help and FAQ content from within the app
FR50: Support staff can search for accounts by parent email or child name
FR51: Support staff can view account history, linked child relationships, and activity timelines
FR52: Support staff can process COPPA deletion requests with an automated workflow
FR53: Support staff can escalate issues to engineering when needed
FR54: Support interactions are logged for compliance and audit
FR55: The app is installable as a PWA on iOS
FR56: The app is installable as a PWA on Android
FR57: The installed app displays as a standalone experience without browser chrome
FR58: The app shows a branded splash screen while loading
FR59: The app works in portrait and landscape orientations
FR60: The app respects safe area insets for notches and home indicators
FR61: The app supports responsive layouts across mobile, tablet, and desktop browsers

### NonFunctional Requirements

NFR1: Home screen and core game pages render first content within 2 seconds on a 4G mobile connection
NFR2: In-app navigation and game screen transitions complete within 1.5 seconds after user input
NFR3: Core gameplay interactions respond within 100 milliseconds on supported devices
NFR4: PWA install and cold start complete within 3 seconds on modern mobile hardware
NFR5: Lighthouse performance score remains ≥85 on mobile and ≥90 on desktop for production releases
NFR6: All user data is encrypted in transit using HTTPS/TLS and encrypted at rest using industry-standard algorithms
NFR7: Parent and child authentication sessions use secure access tokens and expire after a configurable inactivity period
NFR8: The product stores only the minimum personally identifiable information required for COPPA compliance
NFR9: Parent consent and deletion requests are logged and fulfilled within the 30-day SLA
NFR10: The system undergoes a third-party security audit before launch and remediates all critical vulnerabilities prior to production deployment
NFR11: Backend services support at least 3x anticipated launch traffic without more than 10% degradation in user-facing response times
NFR12: Core game sync services maintain ≥99% success rate for save and progress sync operations
NFR13: Production availability for the app's core workflows is at least 99.5% over a 30-day rolling window
NFR14: Monitoring and alerting detect and notify the team of sync failures, accessibility regressions, and critical errors within 10 minutes
NFR15: Data deletion, consent, and audit logs are retained for at least 5 years to support COPPA compliance requirements
NFR16: The app meets WCAG 2.1 AA requirements for all published screens and gameplay flows
NFR17: Keyboard navigation is supported for 100% of interactive game and Parent Zone elements
NFR18: Screen reader compatibility is verified for core game workflows, content sections, and parent reports
NFR19: Accessibility settings (mode, font, color contrast, motion, layout) persist across sessions and devices
NFR20: External services for email reports, analytics, and content review integrate securely with audited API connections
NFR21: Third-party integrations are designed to fail gracefully and do not block core gameplay when temporarily unavailable
NFR22: Builds include automated Lighthouse, accessibility, and regression checks in the CI pipeline
NFR23: Deployments include feature flags for major capabilities and automatic rollback on failure conditions

### Additional Requirements

- No architecture document found in _bmad-output/planning-artifacts.
- No architecture-specific implementation requirements were extracted.


### UX Design Requirements

- No UX design document found in _bmad-output/planning-artifacts.
- UX-specific implementation requirements will be added once the UX artifact is available.


### FR Coverage Map

FR1: Epic 1 - Child Gameplay & Rewards
FR2: Epic 1 - Child Gameplay & Rewards
FR3: Epic 1 - Child Gameplay & Rewards
FR4: Epic 1 - Child Gameplay & Rewards
FR5: Epic 1 - Child Gameplay & Rewards
FR6: Epic 1 - Child Gameplay & Rewards
FR7: Epic 1 - Child Gameplay & Rewards
FR8: Epic 1 - Child Gameplay & Rewards
FR9: Epic 1 - Child Gameplay & Rewards
FR10: Epic 1 - Child Gameplay & Rewards
FR11: Epic 1 - Child Gameplay & Rewards
FR12: Epic 1 - Child Gameplay & Rewards
FR13: Epic 1 - Child Gameplay & Rewards
FR14: Epic 1 - Child Gameplay & Rewards
FR15: Epic 1 - Child Gameplay & Rewards
FR16: Epic 1 - Child Gameplay & Rewards
FR17: Epic 1 - Child Gameplay & Rewards
FR18: Epic 1 - Child Gameplay & Rewards
FR19: Epic 1 - Child Gameplay & Rewards
FR20: Epic 1 - Child Gameplay & Rewards
FR21: Epic 1 - Child Gameplay & Rewards
FR22: Epic 1 - Child Gameplay & Rewards
FR23: Epic 1 - Child Gameplay & Rewards
FR24: Epic 2 - Parent Zone & Consent
FR25: Epic 2 - Parent Zone & Consent
FR26: Epic 2 - Parent Zone & Consent
FR27: Epic 2 - Parent Zone & Consent
FR28: Epic 2 - Parent Zone & Consent
FR29: Epic 2 - Parent Zone & Consent
FR30: Epic 2 - Parent Zone & Consent
FR31: Epic 2 - Parent Zone & Consent
FR32: Epic 2 - Parent Zone & Consent
FR33: Epic 2 - Parent Zone & Consent
FR34: Epic 2 - Parent Zone & Consent
FR35: Epic 2 - Parent Zone & Consent
FR36: Epic 3 - Sync, Data & Compliance
FR37: Epic 3 - Sync, Data & Compliance
FR38: Epic 3 - Sync, Data & Compliance
FR39: Epic 3 - Sync, Data & Compliance
FR40: Epic 3 - Sync, Data & Compliance
FR41: Epic 3 - Sync, Data & Compliance
FR42: Epic 3 - Sync, Data & Compliance
FR43: Epic 4 - Content Management
FR44: Epic 4 - Content Management
FR45: Epic 4 - Content Management
FR46: Epic 4 - Content Management
FR47: Epic 4 - Content Management
FR48: Epic 4 - Content Management
FR49: Epic 5 - Support & Compliance
FR50: Epic 5 - Support & Compliance
FR51: Epic 5 - Support & Compliance
FR52: Epic 5 - Support & Compliance
FR53: Epic 5 - Support & Compliance
FR54: Epic 5 - Support & Compliance
FR55: Epic 6 - PWA Installability & Responsive Experience
FR56: Epic 6 - PWA Installability & Responsive Experience
FR57: Epic 6 - PWA Installability & Responsive Experience
FR58: Epic 6 - PWA Installability & Responsive Experience
FR59: Epic 6 - PWA Installability & Responsive Experience
FR60: Epic 6 - PWA Installability & Responsive Experience
FR61: Epic 6 - PWA Installability & Responsive Experience

## Epic List

### Epic 1: Child Gameplay & Rewards Experience
Enable children to play engaging puzzle games, earn process-based rewards, progress through themed worlds, and access accessible gameplay modes.
**FRs covered:** FR1-FR23

### Epic 2: Parent Zone, Consent, and Family Controls
Allow parents to manage child accounts, consent preferences, privacy settings, reports, and friend feature visibility.
**FRs covered:** FR24-FR35

### Epic 3: Reliable Sync, Data Security, and Compliance Transparency
Provide dependable cloud sync, data persistence, encryption, consent logging, and audit trails for child progress and parent transparency.
**FRs covered:** FR36-FR42

### Epic 4: Content Management and Educational Publishing
Enable content teams to create, review, approve, and deploy educational content while tracking engagement and enforcing accessibility and age-appropriateness.
**FRs covered:** FR43-FR48

### Epic 5: Support Operations and Regulatory Compliance
Equip support staff with tools for account search, issue resolution, COPPA requests, escalations, and compliance auditing.
**FRs covered:** FR49-FR54

### Epic 6: PWA Installability and Cross-Platform Experience
Deliver an installable PWA across iOS, Android, and desktop with responsive layouts, safe-area support, and platform-native app behavior.
**FRs covered:** FR55-FR61
## Epic 1: Child Gameplay & Rewards Experience
Enable children to play engaging puzzle games, earn process-based rewards, progress through themed worlds, and access accessible gameplay modes.

### Story 1.1: Sign in and select linked child profile
As a child, I want to sign in and select my linked child profile so that I can access my own game progress and rewards.

**FRs:** FR1

**Acceptance Criteria:**

**Given** I am a registered child with a linked profile,
**When** I sign in and select my profile,
**Then** I am taken to my personalized home experience,
**And** my saved progress and rewards are displayed.

### Story 1.2: Browse games and educational content
As a child, I want to browse games, Puzzle of the Day, Tell Me Why, and Story Time so that I can choose what to play or read.

**FRs:** FR2, FR7, FR8

**Acceptance Criteria:**

**Given** I am on the app home screen,
**When** I review the available content,
**Then** I can see the five games plus Puzzle of the Day, Tell Me Why, and Story Time,
**And** I can select and start any of the five games,
**And** I can filter content by topic and age-appropriateness.

### Story 1.3: Choose game difficulty and view instructions
As a child, I want to choose difficulty and view game instructions before gameplay begins so that I understand how to play.

**FRs:** FR3

**Acceptance Criteria:**

**Given** I select a game,
**When** I open the game details,
**Then** I can choose a difficulty level and view instructions,
**And** I can start the game only after I have reviewed the instructions.

### Story 1.4: Pause, resume, and recover interrupted gameplay
As a child, I want to pause and resume gameplay and recover from interruptions so that I do not lose progress.

**FRs:** FR4, FR6

**Acceptance Criteria:**

**Given** I am playing a game,
**When** I pause or leave the session,
**Then** I can resume from the same state,
**And** if my session is interrupted by navigation or connection loss, my game state is restored when I return.

### Story 1.5: Earn Thought Sparks and fill the Brain Jar
As a child, I want to earn Thought Sparks for correct answers and progress milestones so that I feel rewarded and can track my progress.

**FRs:** FR5, FR9, FR10

**Acceptance Criteria:**

**Given** I complete correct answers or reach milestones,
**When** I earn rewards,
**Then** I receive immediate feedback for correct and incorrect answers,
**And** Thought Sparks are added to my Brain Jar,
**And** the Brain Jar progress updates visibly.

### Story 1.6: Earn badges, unlock map areas, and evolve my mascot
As a child, I want to earn badges, unlock themed world areas, and evolve my mascot so that I feel motivated by progress.

**FRs:** FR11, FR12, FR14, FR15, FR16, FR17

**Acceptance Criteria:**

**Given** I complete gameplay activities,
**When** I earn process-based achievements,
**Then** badges are awarded with explanations,
**And** world map areas unlock as I meet curriculum milestones,
**And** I can interact with the world map to see unlocked themed areas,
**And** badge award state persists even if cloud sync retries are required,
**And** my mascot evolves with new accessories,
**And** my daily thinking streak is tracked, pauses during defined breaks, and does not reset unfairly.

### Story 1.7: Enable accessibility modes and persist preferences
As a child with accessibility needs, I want to enable accessibility modes and save my preferences so that I can play comfortably every time.

**FRs:** FR18, FR19, FR20, FR21, FR22, FR23

**Acceptance Criteria:**

**Given** I access settings,
**When** I enable Reduced Motion, color-blind, dyslexia-friendly font, text size, or one-handed layout,
**Then** those settings apply immediately,
**And** I can choose Smart, Chill, or Focus mode for gameplay,
**And** keyboard navigation and screen reader compatibility are supported,
**And** reward, progress, and navigation notifications provide accessible equivalents,
**And** they persist across sessions.

## Epic 2: Parent Zone, Consent, and Family Controls
Allow parents to manage child accounts, consent preferences, privacy settings, reports, and friend feature visibility.

### Story 2.1: Create parent account and provide COPPA consent
As a parent, I want to create an account and provide COPPA consent so that I can link my child and comply with privacy regulations.

**FRs:** FR24, FR25

**Acceptance Criteria:**

**Given** I am onboarding a child,
**When** I create a parent account,
**Then** I can link one or more child profiles,
**And** I can provide or withdraw COPPA consent for each child.

### Story 2.2: View Quick View dashboard and weekly summary
As a parent, I want to access a Quick View dashboard with a concise weekly summary so that I can understand my child's progress at a glance.

**FRs:** FR26

**Acceptance Criteria:**

**Given** I am signed in as a parent,
**When** I open Quick View,
**Then** I see a concise weekly progress summary,
**And** the summary includes high-level engagement and achievement metrics.

### Story 2.3: Access Full View dashboard and assessments
As a parent, I want to access a Full View dashboard with detailed skills tracking and assessments so that I can review my child's cognitive development.

**FRs:** FR27, FR28, FR33

**Acceptance Criteria:**

**Given** I choose Full View,
**When** I view the dashboard,
**Then** I see detailed skill tracking, world map progress, streak status, and assessment results,
**And** weekly Brain Reports are available,
**And** quarterly pre/post assessments are visible,
**And** I can view the child's active accessibility settings and learning preferences.

### Story 2.4: Export reports, print certificates, and manage settings
As a parent, I want to export reports, print achievement certificates, and manage my child's settings so that I can keep records and control their experience.

**FRs:** FR29, FR30, FR31, FR32, FR34

**Acceptance Criteria:**

**Given** I am in Parent Zone,
**When** I request a data export or printable certificate,
**Then** the system generates the report or certificate,
**And** I can configure report cadence and detail level from settings,
**And** I can request account deletion with a 30-day SLA and review deletion status,
**And** I can manage child profile settings from Parent Zone.

### Story 2.5: Recover password and control friend feature visibility
As a parent, I want to recover my password securely and manage friend feature visibility so that I can keep my account secure and protect my child's privacy.

**FRs:** FR31, FR35

**Acceptance Criteria:**

**Given** I forget my password,
**When** I initiate recovery,
**Then** I receive secure email verification,
**And** I can reset my password.

**Given** I access friend settings,
**When** I change visibility,
**Then** friend feature visibility updates immediately.

## Epic 3: Reliable Sync, Data Security, and Compliance Transparency
Provide dependable cloud sync, data persistence, encryption, consent logging, and audit trails for child progress and parent transparency.

### Story 3.1: Sync gameplay progress to the cloud when connected
As a child, I want my game progress to sync to the cloud immediately when connected so that my progress is preserved.

**FRs:** FR36, FR40, FR41

**Acceptance Criteria:**

**Given** I complete an activity while online,
**When** the app is connected,
**Then** progress syncs to the cloud immediately,
**And** a success indicator is shown,
**And** sync status and failure notifications are visible,
**And** the system retries sync and preserves progress if immediate sync is delayed.

### Story 3.2: Persist progress across sign-ins and multiple children
As a parent, I want my children's progress to persist across sign-ins and devices so that each linked child record remains intact.

**FRs:** FR37, FR38

**Acceptance Criteria:**

**Given** multiple children are linked to one parent account,
**When** a child signs in on any device,
**Then** their progress and rewards are restored,
**And** each child has a separate progress record.

### Story 3.3: Encrypt sensitive data and capture compliance audit logs
As a system administrator, I want sensitive data encrypted and compliance actions logged so that data is secure and COPPA audits are supported.

**FRs:** FR39, FR42

**Acceptance Criteria:**

**Given** user data is stored,
**When** data is transmitted or stored,
**Then** it is encrypted in transit and at rest,
**And** audit logs capture consent, content review, deletion, and support actions.

## Epic 4: Content Management and Educational Publishing
Enable content teams to create, review, approve, and deploy educational content while tracking engagement and enforcing accessibility and age-appropriateness.

### Story 4.1: Create and submit content for review
As a content manager, I want to create Tell Me Why and Story Time items and submit them for review so that content can be published safely.

**FRs:** FR43, FR46, FR48

**Acceptance Criteria:**

**Given** I create new content,
**When** I submit it,
**Then** it enters the review workflow,
**And** the submission includes metadata for age range, cognitive skill domain, and accessibility.

### Story 4.2: Review, approve, and publish content through staging
As a reviewer, I want to approve, request revisions, or reject content and move approved content through staging to live so that only quality content publishes.

**FRs:** FR44, FR45

**Acceptance Criteria:**

**Given** content is submitted for review,
**When** I review it,
**Then** I can approve, request revision, or reject it,
**And** approved content moves through staging to live publication.

### Story 4.3: Tag content and run A/B tests with engagement tracking
As a content manager, I want to tag content by cognitive skill and run A/B tests so that I can track engagement and improve content.

**FRs:** FR47

**Acceptance Criteria:**

**Given** content is published,
**When** I tag it and enable A/B testing,
**Then** engagement metrics are collected,
**And** I can compare variant performance.

## Epic 5: Support Operations and Regulatory Compliance
Equip support staff with tools for account search, issue resolution, COPPA requests, escalations, and compliance auditing.

### Story 5.1: Search accounts and view activity timelines
As support staff, I want to search accounts by parent email or child name and view activity timelines so that I can resolve issues quickly.

**Acceptance Criteria:**

**Given** I need to troubleshoot an issue,
**When** I search by parent email or child name,
**Then** I can access the account history and activity timeline.

### Story 5.2: Process COPPA deletion requests and escalate issues
As support staff, I want to process COPPA deletion requests and escalate issues to engineering so that compliance and security issues are handled correctly.

**Acceptance Criteria:**

**Given** a deletion request is submitted,
**When** I process it,
**Then** the request enters the 30-day deletion workflow,
**And** I can escalate security issues to engineering.

### Story 5.3: Log support interactions for compliance and audit
As support staff, I want all support interactions logged so that the team can maintain compliance records and audit trails.

**Acceptance Criteria:**

**Given** I resolve or escalate a ticket,
**When** the interaction concludes,
**Then** the interaction is logged,
**And** logs are available for compliance review.

## Epic 6: PWA Installability and Cross-Platform Experience
Deliver an installable PWA across iOS, Android, and desktop with responsive layouts, safe-area support, and platform-native app behavior.

### Story 6.1: Make the app installable as a PWA on iOS and Android
As a user, I want to install the app on iOS and Android so that I can launch it like a native app.

**FRs:** FR55, FR56

**Acceptance Criteria:**

**Given** I visit the app in Safari or Chrome,
**When** the app is eligible for install,
**Then** I can install it on iOS and Android,
**And** the app appears as a standalone home screen icon.

### Story 6.2: Provide standalone PWA behavior, splash screen, and responsive layouts
As a user, I want the installed app to feel like a native app with responsive layouts and safe-area support so that it works well across devices.

**FRs:** FR57, FR58, FR59, FR60, FR61

**Acceptance Criteria:**

**Given** the app is installed,
**When** I launch it,
**Then** it opens in standalone mode without browser chrome,
**And** it shows a branded splash screen,
**And** it supports portrait and landscape with safe-area insets.
