# Final validation — 30 October 2026

Live app: https://oauth-atlas.harwaninoddy.workers.dev/
Repository: https://github.com/burgerdrummer/oauth-atlas

## Observed software behavior

- Public health reports four prepared guides; runtime reports model configured.
- Exact Notion authorization documentation URL produced an AI draft with four retrieved sources. Configuration and connection checks remained unresolved, correctly.
- Name-only Notion research reached synthesis but failed on an invalid citation index. The subsequent correction preserves the supplied source order and marks invalid references unverified with a warning. A fresh post-fix test is required.
- Copy-link round trip and Markdown download were not tested in that failed run.

## Sample source audit

Compared the observed first three Notion steps against https://developers.notion.com/guides/get-started/public-connections and https://developers.notion.com/guides/get-started/authorization .

Supported: developer portal > Build > Public connections; create a connection with name, development workspace, redirects and installation scope; configure capabilities such as read content. Public OAuth page selection differs from manually sharing pages with an internal connection. Installation scope is chosen at creation; marketplace listing is managed separately.

Caution: the generated Admin-dependent difficulty label is an interpretation, not a universal approval requirement. No provider approval SLA was established. The full draft has not been comprehensively audited. No login, registration, consent, API action, refresh or completed approval was performed.

## Evidence runs

- Successful exact-URL generation: https://agent.tinyfish.ai/runs/d49b0df0-9eb3-46cd-8f52-c6a2a50eedf5
- Name-based citation failure: https://agent.tinyfish.ai/runs/1f74599b-77c5-47a1-a9ac-653049a5aa8d

Free model availability and best-effort search remain limitations. Source-linked drafts require review; a checklist is not proof of a working OAuth connection.

## Post-fix live result

Name-only Notion generation succeeded: 'Notion Public Connection for Reading Customer-Selected Pages OAuth setup'. Six steps covered connection creation, capabilities, credentials, authorization, code exchange and refresh. Three source URLs were returned (overview.md, public-connections.md, authorization.md under the Notion guides/get-started path). The copied share URL reopened the same guide. Export was clicked without an error, but the automation did not confirm a downloaded file; download completion remains unverified. External-access requirements remain explicitly unresolved. Full generated-guide correctness is not certified.

Run: https://agent.tinyfish.ai/runs/a1d9db49-7f9e-4a4f-8cf5-d8e660576cfd
