# Evidence audit

Reviewed 2026-10-29. "Documented" does not mean console-tested. "Observed" only describes the actual interaction performed.

| Example / claim | Evidence | Finding / remaining gap |
| --- | --- | --- |
| Box public free developer signup | Browser run https://agent.tinyfish.ai/runs/d6fc2b7d-85eb-47c7-b1c5-8002edc7122d | OBSERVED: signup UI, free developer plan label, identity/password fields and CAPTCHA. No signup submitted, email activated, or authenticated console reached. |
| Box Developer Console | Browser run https://agent.tinyfish.ai/runs/b584556f-9128-4749-b446-c00f0c0d2c72 | OBSERVED: login screen. This is an access handoff, not proof of provider approval difficulty. Third-party browser-profile plan prompt was not Box pricing. |
| Box document download versus metadata | https://developer.box.com/guides/api-calls/permissions-and-errors/scopes/ | DOCUMENTED: scope reference distinguishes read-only and file-download requirements. Grant implications were corrected in the prepared scenario. Endpoint untested. |
| Box customer enterprise enablement | https://developer.box.com/guides/authorization/platform-app-approval/ | DOCUMENTED: policy can add administrator enablement. Do not call this universal provider review. Customer-specific policy remains unknown. |
| Google Gmail scope categories | https://developers.google.com/workspace/gmail/api/auth/scopes | DOCUMENTED: send-only versus restricted inbox access can change verification requirements. No consent configuration observed. |
| GitHub organization restrictions | https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/about-oauth-app-access-restrictions | DOCUMENTED: organization policy can gate OAuth App access. No organization test performed. |
| Asana internal testing versus external distribution | https://developers.asana.com/docs/publish-your-app | DOCUMENTED: obtaining a token does not require submission; use beyond one's own organization/development environment and public listing require review consideration. The AI draft's broad framing was corrected. |
| Asana task-list request | https://developers.asana.com/reference/gettasks | DOCUMENTED: assignee filtering also requires workspace; the generated `tasks?assignee=me` example was incomplete. Do not publish it as a working test. |
| Asana OAuth | https://developers.asana.com/docs/oauth | DOCUMENTED: authorization-code flow and console registration supported. No token exchange or connection observed. |
| Asana automatic guide | Local saved groq-test-result.json and public-source search response | OBSERVED SOFTWARE RESULT: earlier pipeline returned a structured nine-source draft. It was not authenticated provider setup and had factual gaps. Do not treat source URL validation as semantic validation. |

## What changed because of evidence

1. Keep account access, provider review, customer administration, and marketplace listing separate.
2. Show a distinct launch gate; a token or working internal test does not establish external-user readiness.
3. Avoid invented durations. A model's "about one week" is not a reliable SLA without a current supporting source.
4. Bounded retrieval replaces recursive model browsing after high token consumption was measured.
5. Generated guide success is measured separately from source audit and actual OAuth setup success.

## Unverified

Replacement live retrieval/generation; full browser layout; authenticated provider setup; intended API actions; token refresh/reconnection; completed approvals; public deployment and evaluator access. No paid provider account is required to report these limits honestly.
