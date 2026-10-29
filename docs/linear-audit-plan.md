# Linear live-generation acceptance test

Case: provider name Linear; external-user web app reading project issues. This is outside the three prepared guides.

Official reference reviewed: https://linear.app/developers/oauth-2-0-authentication (2026-10-29).

Check the generated guide for:

- User-delegated authorization-code flow, distinct from client credentials.
- Read-only scope choice; no unnecessary write or admin permission.
- State validation, callback registration and optional PKCE branch.
- Current access-token lifetime and refresh behavior, rather than old permanent-token assumptions.
- Separate directory-listing review, customer policy, and OAuth registration; no invented approval SLA.
- Provider console actions, completion checks, human sign-in/consent handoffs, and missing evidence.

Current observed test status: this restricted execution session cannot connect to the user's local app (EACCES), nor retrieve provider pages directly through its terminal. Official documentation was reviewed through the research tool. No Linear guide-generation result or authenticated setup is claimed yet. A user-invoked browser test link can run the actual flow and persist its evidence/guide for inspection.

## Observed first run

The app persisted retrieval evidence for Linear, but it included the homepage, download page, an unrelated LINEAR engineering vendor, and GitHub. No saved completed Linear guide was found at inspection. This did not meet the guide-quality bar. Changes: same-provider documentation discovery, developer-index exploration, OAuth-link prioritization, relevance checks before model calls, and complete/unclosed style and script removal. Cache namespace changed so the failed evidence is not reused. Replacement discovery needs another live run.

## Completed generation and audit

The second live run returned a structured guide using three cited sources from four retrieved pages (six HTTP requests). It still missed the core OAuth page and promoted app actor / optional manifests to requirements. This failed the semantic quality bar despite passing URL integrity. The original draft is retained in examples/linear-original-ai-draft.json; a manually corrected example is in examples/linear-reviewed.json and the library. Retrieval ranking now prioritizes core OAuth authentication over adjacent actor/manifest/file-storage pages, skips example console links, and the generation instructions preserve the requested actor and optional-versus-required distinctions. Those changes have controlled checks; a subsequent generation has not yet been observed.
