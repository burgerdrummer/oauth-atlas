# Error recovery review

The reported HTTP 400 was being flattened into a generic error. The original provider explanation was not retained, so its exact cause cannot be retrospectively asserted.

The replacement stores a redacted diagnostic trail, recovers known structured-output/schema/JSON request errors with a single compatibility-mode attempt, and falls back across configured models within a four-request budget. Successful model text is parsed and validated before citation checks and publishing. Evidence remains cached after failures.

Controlled regressions cover HTTP 400 format rejection, invalid JSON, missing or wrongly typed fields, truncated responses, unavailable services returning HTML, quota metadata, invalid credentials, API-key redaction, persistence failure and evidence reuse after failed generation. These checks do not claim the original live 400 has been reproduced and resolved on the provider. A subsequent live attempt will supply precise diagnostics if recovery is still unsuccessful.
