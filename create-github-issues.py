"""
Creates GitHub milestones (epics) and issues (stories) for Little Thinkers.

Usage:
    export GITHUB_TOKEN=your_personal_access_token
    python3 create-github-issues.py

The token needs: repo > issues (write) scope.
Create one at: https://github.com/settings/tokens
"""

import urllib.request
import urllib.error
import json
import os
import time

OWNER = "kiranpalreddyg-commits"
REPO  = "Little-Thinkers"
TOKEN = os.environ.get("GITHUB_TOKEN", "")

if not TOKEN:
    raise SystemExit("Set GITHUB_TOKEN environment variable first.")

BASE = f"https://api.github.com/repos/{OWNER}/{REPO}"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
}


def api(method, path, body=None):
    url  = BASE + path
    data = json.dumps(body).encode() if body else None
    req  = urllib.request.Request(url, data=data, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        print(f"  ✗ {method} {path} → {e.code}: {e.read().decode()}")
        return None


# ── Epics (milestones) ────────────────────────────────────────────────────────

EPICS = [
    {
        "title": "Epic 1: Child Gameplay & Rewards Experience",
        "description": (
            "Enable children to play engaging puzzle games, earn process-based rewards, "
            "progress through themed worlds, and access accessible gameplay modes. "
            "(FRs: FR1–FR23)"
        ),
    },
    {
        "title": "Epic 2: Parent Zone, Consent, and Family Controls",
        "description": (
            "Allow parents to manage child accounts, consent preferences, privacy settings, "
            "reports, and friend feature visibility. (FRs: FR24–FR35)"
        ),
    },
    {
        "title": "Epic 3: Reliable Sync, Data Security, and Compliance Transparency",
        "description": (
            "Provide dependable cloud sync, data persistence, encryption, consent logging, "
            "and audit trails for child progress and parent transparency. (FRs: FR36–FR42)"
        ),
    },
    {
        "title": "Epic 4: Content Management and Educational Publishing",
        "description": (
            "Enable content teams to create, review, approve, and deploy educational content "
            "while tracking engagement and enforcing accessibility and age-appropriateness. "
            "(FRs: FR43–FR48)"
        ),
    },
    {
        "title": "Epic 5: Support Operations and Regulatory Compliance",
        "description": (
            "Equip support staff with tools for account search, issue resolution, COPPA requests, "
            "escalations, and compliance auditing. (FRs: FR49–FR54)"
        ),
    },
    {
        "title": "Epic 6: PWA Installability and Cross-Platform Experience",
        "description": (
            "Deliver an installable PWA across iOS, Android, and desktop with responsive layouts, "
            "safe-area support, and platform-native app behavior. (FRs: FR55–FR61)"
        ),
    },
]


# ── Stories (issues) ──────────────────────────────────────────────────────────

STORIES = [
    # ── Epic 1 ──────────────────────────────────────────────────────────────
    {
        "epic_index": 0,
        "title": "Story 1.1: Sign in and select linked child profile",
        "body": """**As a** child, **I want to** sign in and select my linked child profile **so that** I can access my own game progress and rewards.

**FRs:** FR1

---

**Acceptance Criteria**

- **Given** I am a registered child with a linked profile,
- **When** I sign in and select my profile,
- **Then** I am taken to my personalized home experience,
- **And** my saved progress and rewards are displayed.""",
    },
    {
        "epic_index": 0,
        "title": "Story 1.2: Browse games and educational content",
        "body": """**As a** child, **I want to** browse games, Puzzle of the Day, Tell Me Why, and Story Time **so that** I can choose what to play or read.

**FRs:** FR2, FR7, FR8

---

**Acceptance Criteria**

- **Given** I am on the app home screen,
- **When** I review the available content,
- **Then** I can see the five games plus Puzzle of the Day, Tell Me Why, and Story Time,
- **And** I can select and start any of the five games,
- **And** I can filter content by topic and age-appropriateness.""",
    },
    {
        "epic_index": 0,
        "title": "Story 1.3: Choose game difficulty and view instructions",
        "body": """**As a** child, **I want to** choose difficulty and view game instructions before gameplay begins **so that** I understand how to play.

**FRs:** FR3

---

**Acceptance Criteria**

- **Given** I select a game,
- **When** I open the game details,
- **Then** I can choose a difficulty level and view instructions,
- **And** I can start the game only after I have reviewed the instructions.""",
    },
    {
        "epic_index": 0,
        "title": "Story 1.4: Pause, resume, and recover interrupted gameplay",
        "body": """**As a** child, **I want to** pause and resume gameplay and recover from interruptions **so that** I do not lose progress.

**FRs:** FR4, FR6

---

**Acceptance Criteria**

- **Given** I am playing a game,
- **When** I pause or leave the session,
- **Then** I can resume from the same state,
- **And** if my session is interrupted by navigation or connection loss, my game state is restored when I return.""",
    },
    {
        "epic_index": 0,
        "title": "Story 1.5: Earn Thought Sparks and fill the Brain Jar",
        "body": """**As a** child, **I want to** earn Thought Sparks for correct answers and progress milestones **so that** I feel rewarded and can track my progress.

**FRs:** FR5, FR9, FR10

---

**Acceptance Criteria**

- **Given** I complete correct answers or reach milestones,
- **When** I earn rewards,
- **Then** I receive immediate feedback for correct and incorrect answers,
- **And** Thought Sparks are added to my Brain Jar,
- **And** the Brain Jar progress updates visibly.""",
    },
    {
        "epic_index": 0,
        "title": "Story 1.6: Earn badges, unlock map areas, and evolve mascot",
        "body": """**As a** child, **I want to** earn badges, unlock themed world areas, and evolve my mascot **so that** I feel motivated by progress.

**FRs:** FR11, FR12, FR14, FR15, FR16, FR17

---

**Acceptance Criteria**

- **Given** I complete gameplay activities,
- **When** I earn process-based achievements,
- **Then** badges are awarded with explanations,
- **And** world map areas unlock as I meet curriculum milestones,
- **And** I can interact with the world map to see unlocked themed areas,
- **And** badge award state persists even if cloud sync retries are required,
- **And** my mascot evolves with new accessories,
- **And** my daily thinking streak is tracked, pauses during defined breaks, and does not reset unfairly.""",
    },
    {
        "epic_index": 0,
        "title": "Story 1.7: Enable accessibility modes and persist preferences",
        "body": """**As a** child with accessibility needs, **I want to** enable accessibility modes and save my preferences **so that** I can play comfortably every time.

**FRs:** FR18, FR19, FR20, FR21, FR22, FR23

---

**Acceptance Criteria**

- **Given** I access settings,
- **When** I enable Reduced Motion, color-blind, dyslexia-friendly font, text size, or one-handed layout,
- **Then** those settings apply immediately,
- **And** I can choose Smart, Chill, or Focus mode for gameplay,
- **And** keyboard navigation and screen reader compatibility are supported,
- **And** reward, progress, and navigation notifications provide accessible equivalents,
- **And** settings persist across sessions.""",
    },

    # ── Epic 2 ──────────────────────────────────────────────────────────────
    {
        "epic_index": 1,
        "title": "Story 2.1: Create parent account and provide COPPA consent",
        "body": """**As a** parent, **I want to** create an account and provide COPPA consent **so that** I can link my child and comply with privacy regulations.

**FRs:** FR24, FR25

---

**Acceptance Criteria**

- **Given** I am onboarding a child,
- **When** I create a parent account,
- **Then** I can link one or more child profiles,
- **And** I can provide or withdraw COPPA consent for each child.""",
    },
    {
        "epic_index": 1,
        "title": "Story 2.2: View Quick View dashboard and weekly summary",
        "body": """**As a** parent, **I want to** access a Quick View dashboard with a concise weekly summary **so that** I can understand my child's progress at a glance.

**FRs:** FR26

---

**Acceptance Criteria**

- **Given** I am signed in as a parent,
- **When** I open Quick View,
- **Then** I see a concise weekly progress summary,
- **And** the summary includes high-level engagement and achievement metrics.""",
    },
    {
        "epic_index": 1,
        "title": "Story 2.3: Access Full View dashboard and assessments",
        "body": """**As a** parent, **I want to** access a Full View dashboard with detailed skills tracking and assessments **so that** I can review my child's cognitive development.

**FRs:** FR27, FR28, FR33

---

**Acceptance Criteria**

- **Given** I choose Full View,
- **When** I view the dashboard,
- **Then** I see detailed skill tracking, world map progress, streak status, and assessment results,
- **And** weekly Brain Reports are available,
- **And** quarterly pre/post assessments are visible,
- **And** I can view the child's active accessibility settings and learning preferences.""",
    },
    {
        "epic_index": 1,
        "title": "Story 2.4: Export reports, print certificates, and manage settings",
        "body": """**As a** parent, **I want to** export reports, print achievement certificates, and manage my child's settings **so that** I can keep records and control their experience.

**FRs:** FR29, FR30, FR31, FR32, FR34

---

**Acceptance Criteria**

- **Given** I am in Parent Zone,
- **When** I request a data export or printable certificate,
- **Then** the system generates the report or certificate,
- **And** I can configure report cadence and detail level from settings,
- **And** I can request account deletion with a 30-day SLA and review deletion status,
- **And** I can manage child profile settings from Parent Zone.""",
    },
    {
        "epic_index": 1,
        "title": "Story 2.5: Recover password and manage friend feature visibility",
        "body": """**As a** parent, **I want to** recover my password securely and manage friend feature visibility **so that** I can keep my account secure and protect my child's privacy.

**FRs:** FR31, FR35

---

**Acceptance Criteria**

- **Given** I forget my password,
- **When** I initiate recovery,
- **Then** I receive secure email verification and can reset my password.

- **Given** I access friend settings,
- **When** I change visibility,
- **Then** friend feature visibility updates immediately.""",
    },

    # ── Epic 3 ──────────────────────────────────────────────────────────────
    {
        "epic_index": 2,
        "title": "Story 3.1: Sync gameplay progress to the cloud when connected",
        "body": """**As a** child, **I want** my game progress to sync to the cloud immediately when connected **so that** my progress is preserved.

**FRs:** FR36, FR40, FR41

---

**Acceptance Criteria**

- **Given** I complete an activity while online,
- **When** the app is connected,
- **Then** progress syncs to the cloud immediately,
- **And** a success indicator is shown,
- **And** sync status and failure notifications are visible,
- **And** the system retries sync and preserves progress if immediate sync is delayed.""",
    },
    {
        "epic_index": 2,
        "title": "Story 3.2: Persist progress across sign-ins and multiple children",
        "body": """**As a** parent, **I want** my children's progress to persist across sign-ins and devices **so that** each linked child record remains intact.

**FRs:** FR37, FR38

---

**Acceptance Criteria**

- **Given** multiple children are linked to one parent account,
- **When** a child signs in on any device,
- **Then** their progress and rewards are restored,
- **And** each child has a separate progress record.""",
    },
    {
        "epic_index": 2,
        "title": "Story 3.3: Encrypt sensitive data and capture compliance audit logs",
        "body": """**As a** system administrator, **I want** sensitive data encrypted and compliance actions logged **so that** data is secure and COPPA audits are supported.

**FRs:** FR39, FR42

---

**Acceptance Criteria**

- **Given** user data is stored,
- **When** data is transmitted or stored,
- **Then** it is encrypted in transit and at rest,
- **And** audit logs capture consent, content review, deletion, and support actions.""",
    },

    # ── Epic 4 ──────────────────────────────────────────────────────────────
    {
        "epic_index": 3,
        "title": "Story 4.1: Create and submit educational content for review",
        "body": """**As a** content manager, **I want to** create Tell Me Why and Story Time items and submit them for review **so that** content can be published safely.

**FRs:** FR43, FR46, FR48

---

**Acceptance Criteria**

- **Given** I create new content,
- **When** I submit it,
- **Then** it enters the review workflow,
- **And** the submission includes metadata for age range, cognitive skill domain, and accessibility.""",
    },
    {
        "epic_index": 3,
        "title": "Story 4.2: Review, approve, and publish content through staging",
        "body": """**As a** reviewer, **I want to** approve, request revisions, or reject content and move approved content through staging to live **so that** only quality content publishes.

**FRs:** FR44, FR45

---

**Acceptance Criteria**

- **Given** content is submitted for review,
- **When** I review it,
- **Then** I can approve, request revision, or reject it,
- **And** approved content moves through staging to live publication.""",
    },
    {
        "epic_index": 3,
        "title": "Story 4.3: Tag content and run A/B tests with engagement tracking",
        "body": """**As a** content manager, **I want to** tag content by cognitive skill and run A/B tests **so that** I can track engagement and improve content.

**FRs:** FR47

---

**Acceptance Criteria**

- **Given** content is published,
- **When** I tag it and enable A/B testing,
- **Then** engagement metrics are collected,
- **And** I can compare variant performance.""",
    },

    # ── Epic 5 ──────────────────────────────────────────────────────────────
    {
        "epic_index": 4,
        "title": "Story 5.1: Search accounts and view activity timelines",
        "body": """**As** support staff, **I want to** search accounts by parent email or child name and view activity timelines **so that** I can resolve issues quickly.

**FRs:** FR50, FR51

---

**Acceptance Criteria**

- **Given** I need to troubleshoot an issue,
- **When** I search by parent email or child name,
- **Then** I can access the account history and activity timeline.""",
    },
    {
        "epic_index": 4,
        "title": "Story 5.2: Process COPPA deletion requests and escalate issues",
        "body": """**As** support staff, **I want to** process COPPA deletion requests and escalate issues to engineering **so that** compliance and security issues are handled correctly.

**FRs:** FR52, FR53

---

**Acceptance Criteria**

- **Given** a deletion request is submitted,
- **When** I process it,
- **Then** the request enters the 30-day deletion workflow,
- **And** I can escalate security issues to engineering.""",
    },
    {
        "epic_index": 4,
        "title": "Story 5.3: Log support interactions for compliance and audit",
        "body": """**As** support staff, **I want** all support interactions logged **so that** the team can maintain compliance records and audit trails.

**FRs:** FR49, FR54

---

**Acceptance Criteria**

- **Given** I resolve or escalate a ticket,
- **When** the interaction concludes,
- **Then** the interaction is logged,
- **And** logs are available for compliance review.""",
    },

    # ── Epic 6 ──────────────────────────────────────────────────────────────
    {
        "epic_index": 5,
        "title": "Story 6.1: Make the app installable as a PWA on iOS and Android",
        "body": """**As a** user, **I want to** install the app on iOS and Android **so that** I can launch it like a native app.

**FRs:** FR55, FR56

---

**Acceptance Criteria**

- **Given** I visit the app in Safari or Chrome,
- **When** the app is eligible for install,
- **Then** I can install it on iOS and Android,
- **And** the app appears as a standalone home screen icon.""",
    },
    {
        "epic_index": 5,
        "title": "Story 6.2: Standalone PWA behavior, splash screen, and responsive layouts",
        "body": """**As a** user, **I want** the installed app to feel like a native app with responsive layouts and safe-area support **so that** it works well across devices.

**FRs:** FR57, FR58, FR59, FR60, FR61

---

**Acceptance Criteria**

- **Given** the app is installed,
- **When** I launch it,
- **Then** it opens in standalone mode without browser chrome,
- **And** it shows a branded splash screen,
- **And** it supports portrait and landscape with safe-area insets.""",
    },
]

# ── Epic label colours ────────────────────────────────────────────────────────

EPIC_COLORS = ["0075ca", "e4e669", "d93f0b", "0e8a16", "5319e7", "f9d0c4"]

LABEL_STORY = {"name": "story", "color": "c5def5", "description": "User story"}


def main():
    print(f"→ Target: {OWNER}/{REPO}\n")

    # 1. Create "story" label
    print("Creating label: story")
    api("POST", "/labels", {"name": LABEL_STORY["name"],
                            "color": LABEL_STORY["color"],
                            "description": LABEL_STORY["description"]})

    # 2. Create one label + one milestone per epic
    milestone_numbers = []
    for i, epic in enumerate(EPICS):
        label_name = f"epic-{i+1}"
        print(f"Creating label: {label_name}")
        api("POST", "/labels", {
            "name": label_name,
            "color": EPIC_COLORS[i],
            "description": epic["title"],
        })

        print(f"Creating milestone: {epic['title']}")
        result = api("POST", "/milestones", {
            "title": epic["title"],
            "description": epic["description"],
            "state": "open",
        })
        milestone_numbers.append(result["number"] if result else None)
        time.sleep(0.3)

    print()

    # 3. Create one issue per story
    for story in STORIES:
        ei = story["epic_index"]
        milestone_num = milestone_numbers[ei]
        label_name = f"epic-{ei+1}"

        print(f"  Creating issue: {story['title']}")
        api("POST", "/issues", {
            "title": story["title"],
            "body": story["body"],
            "milestone": milestone_num,
            "labels": ["story", label_name],
        })
        time.sleep(0.4)   # stay well under GitHub's rate limit

    print("\n✓ Done — check your repo's Issues and Milestones tabs.")
    print(f"  https://github.com/{OWNER}/{REPO}/issues")
    print(f"  https://github.com/{OWNER}/{REPO}/milestones")


if __name__ == "__main__":
    main()
