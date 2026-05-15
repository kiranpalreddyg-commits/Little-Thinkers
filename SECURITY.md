# Security Policy

Little Thinkers is an educational PWA for children aged 7–15. Because we store child profiles and parent account data, we take security seriously and comply with COPPA requirements.

## Supported Versions

Only the latest commit on the `main` branch receives security fixes. This project is in active pre-release development.

| Branch / Version | Security fixes |
|---|---|
| `main` (latest) | ✅ Yes |
| Any older commit | ❌ No |

## Scope

The following are considered in-scope security issues:

- Authentication and session vulnerabilities (login, JWT, cookie handling)
- Privilege escalation (child accessing parent data or vice versa)
- Personally Identifiable Information (PII) exposure — especially child PII
- COPPA violations (data collection without verifiable parental consent)
- Insecure localStorage handling of session tokens or profile data
- Cross-Site Scripting (XSS) in game or content rendering
- Cross-Site Request Forgery (CSRF) on parent account actions
- Insecure dependencies with known CVEs affecting the production build

Out of scope:
- Issues in `NEXT_PUBLIC_USE_MOCK_API=true` mock mode only (not production behaviour)
- Rate limiting on the mock API
- Self-XSS or issues requiring physical access to an unlocked device

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Report privately via GitHub's Security Advisory feature:

1. Go to [github.com/kiranpalreddyg-commits/Little-Thinkers/security/advisories](https://github.com/kiranpalreddyg-commits/Little-Thinkers/security/advisories)
2. Click **"New draft security advisory"**
3. Describe the vulnerability, steps to reproduce, and potential impact

You can also email the maintainer directly (address listed on the GitHub profile).

### What to expect

| Timeframe | Action |
|---|---|
| Within 48 hours | Acknowledgement of your report |
| Within 7 days | Initial triage and severity assessment |
| Within 30 days | Patch released or mitigation communicated |

We follow responsible disclosure. We ask that you give us 30 days to patch before any public disclosure.

## Credential & Token Hygiene

For contributors and maintainers:

- **Never commit secrets.** The `.gitignore` excludes `.env`, `.env.local`, and `*.pem`. Keep it that way.
- **Never paste tokens in chat, issues, or PR descriptions.** If a token is exposed, revoke it immediately at [github.com/settings/tokens](https://github.com/settings/tokens).
- **Use short-lived tokens.** Personal Access Tokens used for scripts (e.g. `create-github-issues.py`) should be scoped narrowly (`repo > issues` only) and revoked after use.
- **Rotate secrets regularly.** Any token used in CI/CD should be stored as a GitHub Actions secret, not hardcoded.

## Child Data & COPPA

Little Thinkers is subject to the Children's Online Privacy Protection Act (COPPA):

- All child profile data is linked to a verified parent account
- Parental consent is required before creating a child profile (Story 2.1)
- Parents may request deletion of all child data within 30 days (Story 2.4, FR30)
- Audit logs are retained for consent, deletion, and support actions (FR42)
- No behavioural advertising or third-party data sharing involving children

If you discover a potential COPPA compliance gap, report it via the advisory process above.

## Dependency Security

We use `npm audit` as part of the CI pipeline. Contributors should run:

```bash
cd little-thinkers-app
npm audit --production
```

before submitting a pull request. PRs that introduce high or critical severity vulnerabilities in production dependencies will not be merged.
