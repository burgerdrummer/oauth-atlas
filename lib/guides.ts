export const guides = [
  {
    "id": "github",
    "name": "GitHub",
    "category": "Developer tools",
    "initials": "GH",
    "color": "#24292f",
    "summary": "Register your app directly. Organization access can add an admin handoff.",
    "difficulty": "Direct setup",
    "effort": "30\u201360 min",
    "wait": "No review wait established for basic registration",
    "audience": "Web app connecting external users\u2019 GitHub accounts through an OAuth App. GitHub Apps are a separate option worth evaluating for granular repository permissions.",
    "checked": "2026-10-28",
    "status": "Source-checked",
    "prerequisites": [
      "A GitHub account, or admin access to the owning organization.",
      "Your product name and public homepage URL.",
      "Your integration platform\u2019s exact OAuth callback URL.",
      "The specific user actions and permissions your integration needs."
    ],
    "steps": [
      {
        "title": "Choose the right GitHub app model",
        "body": "This guide covers OAuth Apps acting on behalf of a user. Evaluate GitHub Apps separately if you need repository-scoped installations. Don\u2019t treat the two registrations as interchangeable.",
        "owner": "Developer",
        "source": 0,
        "where": "GitHub app-model documentation",
        "success": "You have selected and documented the app model that matches your access needs."
      },
      {
        "title": "Register an OAuth App",
        "body": "Open Settings \u2192 Developer settings \u2192 OAuth Apps \u2192 New OAuth App. Enter the application name, homepage, optional description, and authorization callback URL. Register under the account or organization that should own it.",
        "owner": "Developer",
        "source": 0,
        "where": "GitHub Settings > Developer settings > OAuth Apps",
        "success": "The OAuth App appears under the intended owning account.",
        "openUrl": "https://github.com/settings/applications/new"
      },
      {
        "title": "Configure credentials and authorization",
        "body": "Use the registered client credentials in your backend or integration platform. Implement the documented authorization flow and request only scopes needed for the intended actions. Keep secrets out of browser code and source control.",
        "owner": "Developer",
        "source": 1,
        "where": "Your backend or integration platform",
        "success": "The registered callback and requested permissions are configured in your backend."
      },
      {
        "title": "Test personal and organization access separately",
        "body": "Authorize a test account and run one intended API action. If personal access succeeds but organization access fails, check the organization\u2019s OAuth app access policy and request owner approval where needed.",
        "owner": "Developer",
        "source": 2,
        "where": "A test account and the customer organization",
        "success": "The intended action works for a personal account and any required organization access is approved."
      },
      {
        "title": "Check readiness for ongoing use",
        "body": "Test reconnects and the token behavior configured for your app. Confirm the production callback and required organization approvals before inviting customers. Successful registration alone does not validate your integration.",
        "owner": "Developer",
        "source": 1,
        "where": "Your production configuration and test environment",
        "success": "Production callbacks, reconnect behavior, and required access are checked."
      }
    ],
    "blockers": [
      {
        "symptom": "Personal access works; organization resources do not",
        "action": "Ask an organization owner to review the OAuth app access request. Do not broaden scopes to work around organization policy.",
        "owner": "Organization owner",
        "source": 2
      },
      {
        "symptom": "Authorization returns a callback error",
        "action": "Compare the callback sent by your integration with the registered callback and GitHub\u2019s documented redirect rules.",
        "owner": "Developer",
        "source": 1
      }
    ],
    "agent": [
      "Draft the registration values and scope rationale.",
      "Implement callback handling and a minimal connection test.",
      "Prepare troubleshooting checks and inspect non-secret errors."
    ],
    "human": [
      "Choose the owning account and sign in.",
      "Store app credentials securely in your backend or integration platform.",
      "Authorize the test connection; obtain organization-owner approval if required."
    ],
    "uncertainty": [
      "Console registration and API access have not been tested in this project.",
      "Effort is a planning estimate, not measured setup time. Organization approval time depends on the customer."
    ],
    "sources": [
      {
        "title": "Creating an OAuth app",
        "url": "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app"
      },
      {
        "title": "Authorizing OAuth apps",
        "url": "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps"
      },
      {
        "title": "OAuth app access restrictions",
        "url": "https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/about-oauth-app-access-restrictions"
      }
    ],
    "observation": "Official-source review only. No GitHub OAuth App has been registered or connected during this investigation.",
    "next": "Decide whether you need an OAuth App or a GitHub App, then collect the exact callback URL from your integration platform.",
    "managed": "Check Composio\u2019s live managed-auth directory before registering your own app. Custom branding, scopes, or quota needs may still justify your own registration.",
    "where": "Provider developer console"
  },
  {
    "id": "box",
    "name": "Box",
    "category": "Content & collaboration",
    "initials": "box",
    "color": "#1261c9",
    "summary": "Start with free developer access. Customer enterprise settings may add an admin approval step.",
    "difficulty": "Admin-dependent",
    "effort": "1-3 hours",
    "wait": "Customer admin turnaround varies",
    "audience": "A web application connecting external users to their existing Box accounts through a User app using OAuth 2.0.",
    "checked": "2026-10-28",
    "status": "Source-checked",
    "prerequisites": [
      "An activated Box developer account or existing Developer Console access.",
      "The exact callback URL supplied by your integration platform or backend.",
      "A harmless test document and an account permitted to access it.",
      "Access to the customer's Box admin if enterprise policy blocks the app."
    ],
    "steps": [
      {
        "title": "Activate developer access",
        "body": "Create a free Box developer account, or use an existing account with console access. New signup includes a CAPTCHA and documented email activation. The default CCG app is a different authentication model; this guide needs a User app.",
        "owner": "Developer",
        "source": 4,
        "where": "Box developer signup and email inbox",
        "success": "Your account is active and Developer Console access works.",
        "openUrl": "https://account.box.com/signup/developer"
      },
      {
        "title": "Choose a User app",
        "body": "In the Developer Console, choose New App \u2192 User \u2192 Create, as described in current documentation. A User app uses OAuth 2.0. User and Server app types cannot be converted into one another later.",
        "owner": "Developer",
        "source": 0,
        "where": "Box Developer Console > New App > User",
        "success": "A User app is visible in your Developer Console.",
        "openUrl": "https://app.box.com/developers/console"
      },
      {
        "title": "Configure callback and permissions",
        "body": "Set the OAuth redirect URI to the callback supplied by your integration platform. Match the URI exactly, subject to Box\u2019s documented localhost port exception. Select only the required scopes. Server-side API calls do not require CORS configuration.",
        "owner": "Developer",
        "source": 0,
        "where": "App configuration > OAuth redirect URIs",
        "success": "Your callback matches the integration platform configuration."
      },
      {
        "title": "Choose permissions for the intended action",
        "body": "File and folder read access maps to root_readonly. Box's current scope reference explicitly says root_readwrite is necessary to download files and folders. Select permissions for the actual endpoint your agent will use. Document-content retrieval has not been tested here.",
        "owner": "Developer",
        "source": 5,
        "where": "App configuration > Application Scopes",
        "success": "The selected scope set is justified for the intended action."
      },
      {
        "title": "Check enterprise enablement",
        "body": "OAuth apps can require a Box Admin or Co-Admin to enable them when enterprise policy disables unpublished apps by default. Inspect the Enablement tab. Prepare the client ID for the admin; do not share the client secret.",
        "owner": "Customer Box admin",
        "source": 1,
        "where": "App Enablement tab and customer admin",
        "success": "The app is enabled for the target enterprise, or no enablement gate applies."
      },
      {
        "title": "Complete user consent and a minimal API test",
        "body": "Implement the authorization-code flow using the Box SDK or your integration platform. Have a test user grant access, then test one permitted action on a test resource. Access remains limited by the user\u2019s own content permissions.",
        "owner": "Developer",
        "source": 2,
        "where": "Your app and a harmless test resource",
        "success": "Consent completes and the intended file-information or content request succeeds."
      },
      {
        "title": "Verify token rotation and recovery",
        "body": "Box access tokens last 60 minutes. A refresh token lasts 60 days and is single-use; each successful refresh returns a replacement. Persist the latest pair securely. If the refresh token expires, the user must authorize again.",
        "owner": "Developer",
        "source": 3,
        "where": "Your backend token storage and refresh handling",
        "success": "A refresh returns a replacement token and the latest pair is stored securely."
      }
    ],
    "blockers": [
      {
        "symptom": "The enterprise prevents use of the app",
        "action": "Check unpublished-app policy. Use the documented Enablement request or give the Client ID to the Box Admin. Wait time belongs to that enterprise, not a universal Box review SLA.",
        "owner": "Box Admin / Co-Admin",
        "source": 1
      },
      {
        "symptom": "OAuth succeeds but a file cannot be accessed",
        "action": "Check both app scopes and whether the authorizing user owns or collaborates on that test resource.",
        "owner": "Developer + resource owner",
        "source": 2
      },
      {
        "symptom": "The integration disconnects after refresh",
        "action": "Check that the latest replacement refresh token was stored. Never repeatedly reuse an older refresh token.",
        "owner": "Developer",
        "source": 3
      }
    ],
    "agent": [
      "Compare User versus Server authentication for the use case.",
      "Prepare configuration, SDK code, and token-rotation checks.",
      "Draft the admin handoff with app name, purpose, and Client ID."
    ],
    "human": [
      "Sign in, satisfy MFA if required, and control credentials.",
      "Grant consent using a test account.",
      "Have the customer\u2019s Box admin enable the app if enterprise policy requires it."
    ],
    "uncertainty": [
      "App creation, consent, content retrieval, enterprise enablement, and token rotation remain untested.",
      "Scope guidance is checked against official documentation; it still needs an endpoint test.",
      "Allow 1-3 hours with existing OAuth infrastructure as an unmeasured planning estimate. Customer-admin turnaround is unknown."
    ],
    "sources": [
      {
        "title": "Setup with OAuth 2.0",
        "url": "https://developer.box.com/guides/authentication/oauth2/oauth2-setup/"
      },
      {
        "title": "Platform app approval",
        "url": "https://developer.box.com/guides/authorization/platform-app-approval/"
      },
      {
        "title": "Authentication methods and permissions",
        "url": "https://developer.box.com/guides/authentication/"
      },
      {
        "title": "Refresh a token",
        "url": "https://developer.box.com/guides/authentication/tokens/refresh/"
      },
      {
        "title": "Free developer plan and signup",
        "url": "https://developer.box.com/guides/getting-started/free-developer-plan"
      },
      {
        "title": "Box API scopes",
        "url": "https://developer.box.com/guides/api-calls/permissions-and-errors/scopes/"
      }
    ],
    "observation": "A live browser inspected the free developer signup form and visible CAPTCHA. The tested older entry URL returned 404; the direct signup page worked. The authenticated console attempt stopped at sign-in. No User app, consent flow, file retrieval, token refresh, or approval was completed.",
    "next": "Create or sign in to a Box developer account, then confirm you can open the Developer Console.",
    "managed": "Check Composio\u2019s current Box toolkit and managed-auth availability. A managed app does not remove a customer\u2019s enterprise access policies.",
    "where": "Provider developer console"
  },
  {
    "id": "gmail",
    "name": "Gmail",
    "category": "Email & communication",
    "initials": "M",
    "color": "#bf453c",
    "summary": "Choose permissions first. Sending email and reading an inbox have different review paths.",
    "difficulty": "Review-heavy",
    "effort": "1\u20133 hours + preparation",
    "wait": "3\u20135 business days for sensitive-scope review; restricted review can take weeks",
    "audience": "A web app serving external Google users. Send-only uses gmail.send (sensitive); inbox reading uses gmail.readonly (restricted). Personal, testing, and internal-use exceptions must be evaluated separately.",
    "checked": "2026-10-28",
    "status": "Source-checked",
    "prerequisites": [
      "A Google Cloud project with Gmail API enabled.",
      "App name, support contact, target audience, and exact callback URL.",
      "A feature-to-scope decision: send-only versus read/compose access.",
      "For applicable external verification: domain ownership, public homepage, privacy disclosures, scope rationale, and demo video."
    ],
    "steps": [
      {
        "title": "Map your feature to the minimum scopes",
        "body": "gmail.send is sensitive. gmail.readonly and gmail.compose are restricted. Reading is not automatically a lighter review path. Request the narrowest scopes that actually support your feature.",
        "owner": "Developer",
        "source": 0,
        "where": "Gmail scope reference",
        "success": "Each intended feature has a scope and its sensitivity classification recorded.",
        "openUrl": "https://developers.google.com/workspace/gmail/api/auth/scopes"
      },
      {
        "title": "Configure branding, audience, and test users",
        "body": "In Google Auth platform, configure Branding, Audience, and Data Access. For an external app in Testing, add the intended test accounts. Internal-use eligibility depends on your Google Workspace organization.",
        "owner": "Developer",
        "source": 1,
        "where": "Google Auth platform > Branding, Audience, Data Access",
        "success": "App identity, target audience, and permitted test users are configured.",
        "openUrl": "https://console.cloud.google.com/auth/overview"
      },
      {
        "title": "Create the OAuth client",
        "body": "Create the appropriate client for your web application and register your integration platform\u2019s exact authorized redirect URI. Follow the current client-creation instructions and keep credentials on the server.",
        "owner": "Developer",
        "source": 2,
        "where": "Google Auth platform > Clients",
        "success": "The correct client exists with the exact intended callback.",
        "openUrl": "https://console.cloud.google.com/auth/clients"
      },
      {
        "title": "Test the complete connection",
        "body": "Use an allowed test account to grant consent and exercise the exact requested capability. Google\u2019s external Testing mode generally issues refresh tokens that expire after seven days, except for basic identity-only scopes. Refreshing cannot remove that testing restriction.",
        "owner": "Developer",
        "source": 3,
        "where": "Your application and an allowed test account",
        "success": "The test account authorizes successfully and the intended Gmail action is exercised."
      },
      {
        "title": "Prepare the applicable verification package",
        "body": "Check exceptions first. For sensitive-scope verification, prepare scope justifications, correct branding and privacy disclosures, and a demo. Google publishes a typical 3\u20135-business-day review estimate; preparation and rework are additional.",
        "owner": "Developer + provider reviewer",
        "source": 4,
        "where": "Google Verification Center",
        "success": "Required evidence has been submitted or an applicable exception is established."
      },
      {
        "title": "Handle the restricted-scope branch if needed",
        "body": "Restricted access may require an annual independent security assessment when your app accesses data from or through a server. Review the applicable exceptions and permitted-use rules. Do not promise approval dates or assessment costs without evidence.",
        "owner": "Developer + provider reviewer",
        "source": 5,
        "where": "Google restricted-scope review and assessment process",
        "success": "Required assessment and review steps are identified; completion depends on the provider."
      }
    ],
    "blockers": [
      {
        "symptom": "The app works for you but another account cannot connect",
        "action": "Check Testing status, the test-user list, audience, and the customer\u2019s Workspace app controls before changing code.",
        "owner": "Developer / Workspace admin",
        "source": 1
      },
      {
        "symptom": "Connections expire after seven days",
        "action": "Inspect external Testing status. A refresh worker cannot extend an expired testing refresh token; users must reauthorize. Determine the appropriate production and verification path.",
        "owner": "Developer",
        "source": 3
      },
      {
        "symptom": "Review requests more evidence",
        "action": "Check the Verification Center and reviewer email. Ensure your demonstration shows the exact consent flow and actual use of every requested permission.",
        "owner": "Product owner",
        "source": 4
      }
    ],
    "agent": [
      "Audit feature-to-scope choices and find narrower alternatives.",
      "Prepare the setup checklist, callback code, and test cases.",
      "Draft a demo script and identify missing verification evidence."
    ],
    "human": [
      "Own the Cloud project and verify the domain.",
      "Provide accurate product and privacy information and authorize test access.",
      "Record the actual product demo and respond to reviewers; commission an assessment if applicable."
    ],
    "uncertainty": [
      "The console, consent flow, and Gmail API have not been tested here.",
      "Published review estimates are not end-to-end delivery guarantees.",
      "Hands-on effort is a planning estimate. Security-assessment pricing and exact applicability depend on the product."
    ],
    "sources": [
      {
        "title": "Gmail scopes and sensitivity",
        "url": "https://developers.google.com/workspace/gmail/api/auth/scopes"
      },
      {
        "title": "Configure consent and scopes",
        "url": "https://developers.google.com/workspace/guides/configure-oauth-consent"
      },
      {
        "title": "Create access credentials",
        "url": "https://developers.google.com/workspace/guides/create-credentials"
      },
      {
        "title": "Refresh-token expiration",
        "url": "https://developers.google.com/identity/protocols/oauth2#expiration"
      },
      {
        "title": "Sensitive-scope verification",
        "url": "https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification"
      },
      {
        "title": "Restricted-scope verification",
        "url": "https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification"
      }
    ],
    "observation": "Official-source review only. No Cloud project, OAuth client, consent flow, or Gmail API call was completed during this investigation.",
    "next": "Write down whether your agent needs to send email, read email, or manage drafts. Check the corresponding scope classification before planning your launch.",
    "managed": "Composio can offer managed OAuth for Gmail. Check current permissions and availability first; custom branding or additional scopes can require your own app and verification.",
    "where": "Provider developer console"
  },
  {
    "name": "Linear",
    "category": "Project management",
    "summary": "Register a user-delegated OAuth app for reading issues. Public distribution, actor choice, and directory listing are separate decisions.",
    "audience": "An external-user web app reading issues using each authorizing user\u2019s access. App-actor authorization and client credentials are separate use cases.",
    "prerequisites": [
      "A Linear account with access to the app-management workspace; verify the required workspace role.",
      "Your callback URL and an application endpoint that can receive the authorization response.",
      "A server-side credential and token store, or an appropriate PKCE implementation."
    ],
    "difficulty": "Unconfirmed",
    "effort": "30-90 min (estimate)",
    "wait": "Unknown: no external-user approval SLA verified in this audit.",
    "managed": "Check Composio\u2019s current managed-auth directory before creating your own app. Coverage is not established by this example.",
    "steps": [
      {
        "title": "Register an OAuth application",
        "body": "Use Linear\u2019s OAuth app creation settings and register your redirect callback. A manifest is an optional reproducible configuration format, not a mandatory first step.",
        "where": "Linear settings: API / OAuth applications",
        "success": "An app exists and the intended callback is registered.",
        "owner": "Developer / account owner",
        "source": 0,
        "openUrl": "https://linear.app/settings/api/applications/new"
      },
      {
        "title": "Choose distribution for the intended audience",
        "body": "Private distribution is the default. Public distribution allows installation by other workspaces. Verify required app metadata and target-workspace policies; this setting does not establish a completed provider review.",
        "where": "OAuth app distribution settings",
        "success": "Distribution matches internal testing or external-workspace installation.",
        "owner": "App owner",
        "source": 1
      },
      {
        "title": "Use read access and the user actor",
        "body": "For reading on behalf of individual users, use read access and retain the default user actor. App-actor authorization is an alternative installation model, not a requirement for this task.",
        "where": "OAuth authorization request",
        "success": "The request uses read access and the intended actor without unnecessary write/admin permissions.",
        "owner": "Developer",
        "source": 0
      },
      {
        "title": "Implement consent and callback validation",
        "body": "Send the user through authorization-code consent, match the callback and validate state. If using PKCE, follow the documented challenge and verifier branch.",
        "where": "Your application and Linear consent screen",
        "success": "A consenting test user returns a code with matching state.",
        "owner": "Developer and test user",
        "source": 0
      },
      {
        "title": "Exchange and refresh tokens securely",
        "body": "Follow the documented token exchange for your chosen confidential-client or PKCE branch. Access tokens last 24 hours; persist refreshed replacement tokens securely and test recovery.",
        "where": "Server-side OAuth callback and token store",
        "success": "Token exchange and a subsequent refresh succeed in a real test.",
        "owner": "Developer",
        "source": 0
      },
      {
        "title": "Validate intended issue access before launch",
        "body": "Use the obtained token with Linear\u2019s GraphQL API. Test the actual read operation for the intended project and workspace; a successful viewer check alone does not establish issue access. Validate a second target workspace before external launch.",
        "where": "Your integration test environment",
        "success": "The intended test user can read permitted project issues, while unauthorized resources remain unavailable.",
        "owner": "Developer and target-workspace tester",
        "source": 0
      }
    ],
    "blockers": [
      {
        "symptom": "The app cannot be installed outside its owning workspace",
        "action": "Check distribution: private is the default; use public for other workspaces. If still blocked, ask the target workspace owner to identify its actual policy.",
        "owner": "App owner and target workspace owner",
        "source": 1
      },
      {
        "symptom": "The guide proposes app-actor mode for user-delegated reading",
        "action": "Use the default user actor for this scenario. Evaluate app-actor authorization only if the product needs actions attributed to an installed application.",
        "owner": "Developer",
        "source": 2
      },
      {
        "symptom": "Approval requirements or waiting time remain unclear",
        "action": "Check current official distribution/directory requirements and ask Linear support about any unresolved external-user restriction. Do not invent an approval duration.",
        "owner": "Developer",
        "source": -1
      }
    ],
    "agent": [
      "Extract registration requirements and draft callback/scope configuration from cited docs.",
      "Prepare state/PKCE and token-refresh test cases; a human must actually run them."
    ],
    "human": [
      "Sign in to Linear, create the app, and store credentials securely.",
      "Authorize with a test user, verify intended issue access, and confirm target-workspace policy before launch."
    ],
    "uncertainty": [
      "Required app-creator role and customer-workspace restrictions remain untested.",
      "No mandatory provider review or review timeline was established for this scenario; public distribution is not proof that all customer policies permit installation.",
      "The automatically generated draft did not pass the audit. This example was manually corrected; it is not a new successful generation test."
    ],
    "sources": [
      {
        "title": "Linear OAuth 2.0 authentication",
        "url": "https://linear.app/developers/oauth-2-0-authentication"
      },
      {
        "title": "Linear OAuth app manifests and distribution",
        "url": "https://linear.app/developers/oauth-app-manifests"
      },
      {
        "title": "Linear OAuth actor authorization",
        "url": "https://linear.app/developers/oauth-actor-authorization"
      }
    ],
    "next": "Open Linear\u2019s OAuth application settings and register your callback. Choose public distribution for installation beyond the owning workspace; verify any policy constraints before launch.",
    "id": "linear",
    "initials": "LI",
    "color": "#5e6ad2",
    "checked": "2026-10-29",
    "status": "Source-reviewed",
    "goal": "Read project issues on behalf of external users",
    "scopeText": "read; user actor by default",
    "requestContext": {
      "app": "Linear",
      "purpose": "Read project issues for external users through user-delegated OAuth; validate registration and external-user access"
    },
    "observation": "The live generator produced a Linear draft from four pages. A subsequent manual source audit found incorrect actor selection and an optional manifest treated as required. This reviewed example corrects those claims using the linked official documentation. No authenticated Linear setup, consent, token exchange, issue query, or approval was attempted."
  }
];
