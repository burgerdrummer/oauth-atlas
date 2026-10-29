# OAuth Atlas

A focused Composio APM take-home: look up a provider, understand OAuth registration and external-user approval, follow a sourced checklist, and share the guide.

## Run

Node 22.13+ (24 recommended). No npm install or runtime dependencies.

```sh
cp .env.example .env.local
# Set GROQ_API_KEY in .env.local; never commit it.
node scripts/build-atlas.mjs
node scripts/check-atlas.mjs
node scripts/check-errors.mjs
node scripts/check-product.mjs
node scripts/serve-atlas.mjs
```

Open http://127.0.0.1:4173. On the author's Windows machine, Open-Atlas.cmd chooses an available port, verifies the server responds, and opens that address. It discovers an installed compatible Node runtime; reviewers should use the commands above. Optional GEMINI_API_KEY/GEMINI_MODEL enables a text-generation fallback; Google Search grounding is never requested. No paid account or provider approval is needed to try the slice. Free inference remains subject to account quotas and availability.

## Scope and product decisions

- Four examples cover GitHub organization policy, Box user-delegated OAuth and customer-admin enablement, Gmail scope-dependent verification, and an audited Linear generation. A single schema supports a 100-provider library; three prepared records and one manually audited Linear example are supplied.
- Start with intended actions. Box document contents and metadata have different permission implications; Gmail send-only and inbox access have different review paths. A provider name alone is insufficient.
- Show testing readiness separately from readiness for external customers. Distinguish provider verification, customer-admin approval, and marketplace listing. None is established by checking off configuration steps.
- Separate hands-on effort estimates from external waiting. Unknown waits remain unknown. No authenticated end-to-end connection is claimed.
- Ask whether Composio managed auth already covers the use case before custom registration.
- Contextual blocker guidance is in scope. Conversational AI troubleshooting is optional and remains disabled; required live guide generation takes priority.

## Live generation and cost controls

For app names, the pipeline performs one public search-discovery request; supplied documentation URLs skip search and are fetched first. It retrieves at most four readable pages, limits the entire HTTP traversal to eight requests including redirects, and supplies at most 8,800 excerpt characters to one structured guide-generation call. No recursive model browsing, paid search grounding, or browser automation is used. A failed model call can try a configured alternative; there is no unlimited retry loop.

Discovery currently uses Bing's public RSS search output, which is an undocumented, best-effort dependency. Search snippets never count as source evidence. A developer can submit the exact official documentation URL when discovery is unavailable. JavaScript-only, login-protected, inaccessible, or ambiguous sites can remain unresolved. The agent must report gaps instead of inventing instructions. This replacement pipeline has passed controlled tests but still needs a live retrieval-and-generation run.

Public HTML is reduced to text, scripts are discarded, and selected excerpts are supplied as untrusted data. HTTPS URL checks reject credentials, IP literals, private-style hostnames and custom ports; redirect destinations are rechecked. This is not a full DNS-rebinding defense or a production fetch proxy. The demo is intended for public provider documentation only.

Local evidence and complete guides persist for 24 hours under ignored .sites-runtime/research-cache. Memory caches and in-flight request coalescing avoid duplicate work. The browser also reuses previously saved identical guide requests. Hosted Worker instances currently have only memory caching unless a durable cache adapter is supplied. No hosted durability is claimed.

Source integrity means that every cited URL was actually retrieved. It does not establish that a claim follows from a page. AI drafts are labeled and require source review. Effort, external-user access, scopes, and review timelines are especially important audit targets.

## Demo

1. Open Box; switch metadata versus document contents. Inspect prerequisites, human sign-in/admin handoffs, success checks and evidence.
2. Open Gmail; compare send-only versus inbox scope paths and verification requirements.
3. Open GitHub; distinguish OAuth Apps from GitHub Apps and organization access policy.
4. Submit an unfamiliar app or developer-documentation URL plus intended actions. Review retrieved sources, uncertainty and the next action.
5. Repeat the same request to demonstrate reuse. Export Markdown or copy the snapshot URL.

Scenario choices are preserved in prepared-guide links. Generated guides are encoded in share-link fragments and remain labeled drafts. Localhost URLs only work on the same computer; export Markdown for external sharing until hosted. A private hosted URL requires recipient access.

## Evidence and corrections

See docs/evidence-audit.md and docs/submission-checklist.md. Box public signup and console-login behavior were observed with a browser agent. No account was created. No authenticated app registration, consent, refresh, API call, or approval was tested.

The earlier Groq browser-agent implementation successfully researched Asana and produced a guide, but one research run consumed approximately 48,000 tokens. It exhausted free-tier allowances during repeated tests. That implementation was replaced rather than represented as dependable. Its Asana draft also needed factual corrections: external-workspace access requires separate review consideration, and the sample task-list query omitted workspace. Generation success is not correctness.

## Validation

```sh
node scripts/build-atlas.mjs
node scripts/check-atlas.mjs
node scripts/check-errors.mjs
node scripts/check-product.mjs
```

Controlled checks cover request validation, source integrity, public-URL restrictions, bounded retrieval, one-call synthesis without search tools, persistent-cache restore, and evidence recovery after failed generation. They do not prove live API availability, browser layout, actual provider setup, or submission readiness.

## Implementation and limits

- lib/guides.ts: prepared guide data and supporting links.
- src/evidence.mjs: bounded discovery, public-document retrieval and excerpt extraction.
- src/research.mjs: orchestration, citation checks and cache hooks.
- src/models.mjs: structured-output compatibility recovery, model failover, validation and redacted diagnostics.
- src/client.js and src/style.css: library, scenarios, checklists, blockers, source labels, sharing and export.
- scripts/serve-atlas.mjs: local server with disk-cache adapter and automatic Worker reload.
- scripts/build-atlas.mjs: dependency-free Worker bundle and hosting metadata.

No credentials belong in source, exports or screenshots. Source repository: https://github.com/burgerdrummer/oauth-atlas. A verified hosted deployment remains outstanding. The Sites identity is retained in .openai/hosting.json; source synchronization from the restricted execution environment has failed. Do not submit localhost as a public working link.

## Model failure recovery

A rejected structured-output request can retry once in JSON-object mode, with the same schema supplied as instructions and checked locally. Every completed guide must pass required-field/type checks and retrieved-source integrity. Formatting, network, availability and quota failures can move to another configured model. At most four model requests are attempted for one guide, including compatibility retries. No browser/search model tools are enabled.

Sanitized provider explanations are stored with the already retrieved evidence in the local cache; API keys and raw provider credential errors are not shown in the product. The error reference identifies that evidence record. Failed generation keeps the evidence available for a retry. Cache-adapter errors fall back to memory rather than discarding a valid guide.

The interface preserves editable inputs after failure, displays provider retry timing when supplied, tolerates malformed saved progress, and ignores stale responses after the research dialog is closed. Closing stops waiting in the browser; a server-side generation already started may still finish and cache its result.

## Focused product additions within the take-home

Research asks for intended operation, connecting audience and managed/custom preference. These choices are included in the model input, saved guide and cache key. Prepared guides offer a link to adapt the scenario rather than silently applying one audience to everyone.

Before generation, a coverage check looks for provider identity, user-delegated OAuth, registration and permission signals in the actual retrieved excerpts. Missing core signals return a shareable investigation checklist without a model call; managed-app requests return coverage checks without claiming Composio supports the provider. This is a conservative text-coverage check, not semantic validation or proof of approval. Sources and open questions remain visible.

Direct destinations were added where known. Handoff drafts include the use case, expected result, owner, documentation and redacted-error placeholders. They are copied for user review; no email or provider request is sent. Configuration, connection tests and external-access checks are self-reported separately from checklist completion, stored per scenario in the current browser, and included in Markdown exports.

No paid service, extra provider account, chatbot, database, completed OAuth approval, or 100-guide content expansion was added. The submission still needs an accessible hosted experience and successful live verification of the latest pipeline. Current additions have controlled tests, not a newly observed end-to-end browser or provider setup test.
