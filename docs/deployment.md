# Deploy from GitHub to Cloudflare Workers

The repository includes a Worker entry point and Wrangler configuration. No database, custom domain or paid model plan is required by the implementation. Hosting and model account limits still apply. Deployment has not yet been verified.

1. Sign in to the Cloudflare dashboard and open Workers & Pages.
2. Create an application, choose the GitHub repository `burgerdrummer/oauth-atlas`, and select branch `main`.
3. Set Worker name to `oauth-atlas`, root directory to the repository root, build command to `npm run build`, and deploy command to `npx wrangler deploy`. The Wrangler build hook also builds the bundle if deploying from the CLI.
4. Deploy. Existing prepared guides work before a model key is configured.
5. In the Worker's Settings > Variables and Secrets, add `GROQ_API_KEY` as a secret using your existing key. This is a runtime secret, not a GitHub file or build variable. Save/deploy the change. `GROQ_MODEL` is already configured.
6. Open the assigned workers.dev URL in a separate browser session. Confirm `/health` returns `ok: true`, then open the library, research an unfamiliar provider, inspect its sources, export Markdown and test the share link.

An optional guided deploy flow is available at https://deploy.workers.cloudflare.com/?url=https://github.com/burgerdrummer/oauth-atlas . This flow may create a copy of the repository; importing the existing repository in the dashboard keeps future updates tied to the original.

## Live validation

An HTTP 200 investigation checklist is not a successful setup guide. Require an actual generated draft, review its registration and permission instructions against retrieved documentation, and record unresolved launch requirements. Try app-name discovery and the exact official documentation URL separately. Record failures honestly.

Keep credentials in the hosting secret settings. Source and exported guides must never include real keys. Hosted caching and throttling are per Worker instance; this is a take-home demonstration, not production quota protection.

Official documentation:
- https://developers.cloudflare.com/workers/ci-cd/builds/
- https://developers.cloudflare.com/workers/configuration/secrets/
- https://developers.cloudflare.com/workers/platform/deploy-buttons/
