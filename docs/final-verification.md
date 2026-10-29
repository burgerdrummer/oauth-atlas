# Submission verification

Checked 2026-10-29.

- Build succeeds with four prepared guides.
- All five controlled suites pass: routes/retrieval, product scenarios, model errors, guide interactions, and client error recovery.
- Fixed the ignored configuration template, stale example count and obsolete launcher port in setup instructions.
- Live Notion research from the execution environment returned no readable documentation. No successful new guide or source audit is claimed.
- Source synchronization failed with `getaddrinfo() thread failed to start`. The hosting service reports no saved or deployed version. Public URL and repository publication remain blocked.
- Browser rendering, external visitor access and production model configuration remain unverified.
- Exact documentation URLs now bypass search and are fetched first; a regression test verifies this even when search is unavailable. App-name discovery still needs a successful live check.
- Windows launchers now discover a compatible Node installation instead of referring to an expired runtime path. The current server passed its local startup check at port 61202; this is not public deployment evidence.

## Required final demonstration

1. Run `node scripts/test-groq.mjs Notion` from the configured checkout. It writes `groq-test-result.json` locally; that file is excluded from Git. An investigation checklist counts as incomplete, not successful setup guidance.
2. Audit a completed draft against its retrieved sources: OAuth app registration, minimum permissions, external customer access, approval waits and human handoffs.
3. Publish source and deploy with server-side model credentials. Check evaluator access in a separate browser session.
4. Browse Box and Gmail, generate an unfamiliar guide, then open its share link and export Markdown.

The submission consists of the working URL and accessible repository URL. README and evidence notes live in the repository. A short recorded demo is optional, and does not replace the working live-generation requirement.
