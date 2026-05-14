# Little Thinkers — Project Index

## Root Files

- **[README.md](./README.md)** - Project overview, stack, and quick-start commands
- **[create-github-issues.py](./create-github-issues.py)** - Script to bulk-import epics/stories into GitHub Issues
- **[LICENSE](./LICENSE)** - Project license

## Subdirectories

### docs/

- **[FR_VALIDATION_REPORT.md](./docs/FR_VALIDATION_REPORT.md)** - Functional requirements validation report (68 FRs)
- **[little-thinkers-addendum.docx](./docs/little-thinkers-addendum.docx)** - Project addendum document
- **[little-thinkers-agent-system.html](./docs/little-thinkers-agent-system.html)** - Multi-agent AI system overview
- **[little-thinkers-architecture.docx](./docs/little-thinkers-architecture.docx)** - Architecture design document
- **[platform-decision.jsx](./docs/platform-decision.jsx)** - PWA vs native app comparison decision matrix

### _bmad-output/planning-artifacts/

- **[architecture.md](./_bmad-output/planning-artifacts/architecture.md)** - System architecture solution design
- **[epics.md](./_bmad-output/planning-artifacts/epics.md)** - Epic and story breakdown from PRD
- **[implementation-readiness-report-2026-05-11.md](./_bmad-output/planning-artifacts/implementation-readiness-report-2026-05-11.md)** - Pre-sprint implementation readiness assessment
- **[prd.md](./_bmad-output/planning-artifacts/prd.md)** - Product requirements document

### _bmad-output/implementation-artifacts/

- **[1-1-sign-in-and-select-linked-child-profile.md](./_bmad-output/implementation-artifacts/1-1-sign-in-and-select-linked-child-profile.md)** - Story 1.1: parent sign-in and child profile selection
- **[1-2-browse-games-and-educational-content.md](./_bmad-output/implementation-artifacts/1-2-browse-games-and-educational-content.md)** - Story 1.2: browsing games and educational content
- **[sprint-status.yaml](./_bmad-output/implementation-artifacts/sprint-status.yaml)** - Sprint story and epic status tracking
- **[tests/test-summary.md](./_bmad-output/implementation-artifacts/tests/test-summary.md)** - Generated test automation coverage summary

### little-thinkers-app/

- Next.js application source code (React 19, Zustand, Tailwind CSS 4)
- Unit/integration tests: `npm test` (69 Vitest + RTL tests)
- E2E tests: `npm run test:e2e` (17 Playwright tests)
