# CYBER SKY — Execution Roadmap

> Step-by-step implementation checklist from an empty repository to a hardened, deployable product.
>
> **Status:** `[ ]` Not started · `[~]` In progress · `[x]` Complete · `[!]` Blocked  
> **Rule:** A milestone is complete only when its exit criteria and tests pass.

## How to execute
- Build vertical slices, not disconnected layers.
- Keep `Project.md`, `Tech-Stack.md` and `System-Architecture.md` current.
- Convert tasks into issues/PRs with acceptance criteria.
- Record important choices in `docs/adr/`.
- Only test assets you own or are explicitly authorised to test.
- Preserve raw scanner output; AI adds context but does not erase evidence.
- Complete the core CI/CD workflow before expanding into every product module.

---

## Milestone 0 — Product definition and threat model

### Product scope
- [ ] 01. Confirm first persona: developer/security engineer at a small or mid-sized software organisation.
- [ ] 02. Document top user problems and primary user journeys.
- [ ] 03. Choose first Git provider and CI platform.
- [ ] 04. Define the first meaning of “plug-and-play”.
- [ ] 05. Separate CMP6200 deliverables from long-term product ambitions.
- [ ] 06. Define non-goals: unrestricted internet pentesting, autonomous production changes, full EDR, full CSPM and runtime prevention.
- [ ] 07. Convert MVP requirements into prioritised user stories.
- [ ] 08. Define functional and non-functional acceptance criteria.
- [ ] 09. Create assumptions, risks and open-decision registers.

### Safety and privacy
- [ ] 10. Identify sensitive assets: code, credentials, findings, prompts, traces and configuration.
- [ ] 11. Draw trust boundaries between client, API, database, queue, worker, model and sandbox.
- [ ] 12. Threat-model prompt injection in source, package metadata, scanner output and web content.
- [ ] 13. Define authorised target verification and allowlists.
- [ ] 14. Define tool permissions, network egress, timeouts and resource limits.
- [ ] 15. Define human approval requirements for intrusive tests and code changes.
- [ ] 16. Define redaction, retention, deletion and external model data policies.
- [ ] 17. Create a safe lab using OWASP Juice Shop and/or DVWA.
- [ ] 18. Document ethical and legal constraints for evaluation.

**Exit:** agreed MVP, user journeys, threat model, safe lab and measurable acceptance criteria.

## Milestone 1 — Repository and developer foundation

- [ ] 01. Create the source repository and protect the main branch.
- [ ] 02. Add README, project documents and ADR template.
- [ ] 03. Add `.editorconfig`, lint, format and TypeScript configuration.
- [ ] 04. Add `.gitignore` for secrets, build outputs and local data.
- [ ] 05. Pin runtime/tool versions and commit lockfiles.
- [ ] 06. Create workspace scripts and consistent package commands.
- [ ] 07. Add `.env.example` containing placeholders only.
- [ ] 08. Add Docker Compose for PostgreSQL and Redis.
- [ ] 09. Add local object storage if required for artefacts.
- [ ] 10. Add health checks and deterministic seed data.
- [ ] 11. Add one-command setup and development instructions.
- [ ] 12. Add CI for install, type-check, lint, tests and build.
- [ ] 13. Add dependency audit and secret scanning.
- [ ] 14. Publish CI test/build artefacts.
- [ ] 15. Document local setup and troubleshooting.

**Exit:** a fresh clone can start dependencies and pass CI using documented commands.

## Milestone 2 — Backend foundation and contracts

- [ ] 01. Spike Hono versus Elysia; choose one and record an ADR.
- [ ] 02. Create API app with validated configuration.
- [ ] 03. Add health, readiness and version endpoints.
- [ ] 04. Add structured logging and request/correlation IDs.
- [ ] 05. Define consistent error format and request validation.
- [ ] 06. Define API versioning and OpenAPI generation.
- [ ] 07. Add rate limits, request size limits and graceful shutdown.
- [ ] 08. Define domain modules and service boundaries.
- [ ] 09. Model Organisation, User, Membership and Role.
- [ ] 10. Model Project and Integration.
- [ ] 11. Model Scan, ScannerRun, Finding and FindingEvidence.
- [ ] 12. Model Job, AgentRun, ValidationResult and AuditEvent.
- [ ] 13. Add Prisma schema, migrations and seed scripts.
- [ ] 14. Add indexes based on real query patterns.
- [ ] 15. Add unit/integration tests for repositories and services.

**Exit:** backend can persist and query core entities with validated API contracts.

## Milestone 3 — Authentication and tenant isolation

- [ ] 01. Choose browser session/authentication approach.
- [ ] 02. Implement sign-in, sign-out and session validation.
- [ ] 03. Implement organisation membership and role checks.
- [ ] 04. Add project-level permissions.
- [ ] 05. Enforce tenant scope in every relevant service/query.
- [ ] 06. Store integration credentials securely or as encrypted secret references.
- [ ] 07. Add audit events for privileged operations and denied access.
- [ ] 08. Test cross-tenant reads and writes.
- [ ] 09. Test expired/revoked credentials and permission changes.
- [ ] 10. Document service identities and token rotation.

**Exit:** users can only access authorised organisation/project resources; isolation tests pass.

## Milestone 4 — Web application foundation

- [ ] 01. Create Next.js + TypeScript app.
- [ ] 02. Configure Tailwind, shadcn/ui and design tokens.
- [ ] 03. Build navigation, page shell, forms, tables and dialogs.
- [ ] 04. Implement session-aware routes.
- [ ] 05. Build organisation/workspace selector.
- [ ] 06. Build project list, create and detail pages.
- [ ] 07. Build repository integration setup.
- [ ] 08. Build scan history and status views.
- [ ] 09. Build findings list with filtering and sorting.
- [ ] 10. Build finding detail with raw scanner data and AI analysis clearly separated.
- [ ] 11. Add loading, empty, error and forbidden states.
- [ ] 12. Add responsive/accessibility checks.
- [ ] 13. Add component and browser tests.
- [ ] 14. Ensure backend—not UI visibility—enforces all security permissions.

**Exit:** a user can sign in, create a project and inspect scan/finding data.

## Milestone 5 — Scanner adapter framework

- [ ] 01. Define adapter interface: metadata, config validation, execute, parse, health and version.
- [ ] 02. Define canonical finding schema and stable fingerprint.
- [ ] 03. Preserve source tool, rule ID, severity, confidence and raw output reference.
- [ ] 04. Normalise paths, line ranges, package coordinates and resource identifiers.
- [ ] 05. Define timeout, memory and output-size limits.
- [ ] 06. Distinguish scanner failure from a clean scan.
- [ ] 07. Add schema validation and fixture-based parser tests.
- [ ] 08. Integrate Semgrep for selected SAST rules.
- [ ] 09. Integrate Gitleaks for secrets.
- [ ] 10. Integrate Trivy for selected dependency/container/filesystem/IaC checks.
- [ ] 11. Integrate OWASP ZAP against the authorised lab target.
- [ ] 12. Select fifth scanner capability based on a documented gap.
- [ ] 13. Pin tool versions and container images where practical.
- [ ] 14. Add safe default configurations and diagnostics.
- [ ] 15. Store raw reports as immutable artefacts.
- [ ] 16. Add scan summary and explicit failure reasons.

**Exit:** configured tools run, raw reports persist and normalised findings appear in the UI.

## Milestone 6 — Durable scan orchestration

- [ ] 01. Implement scan creation and lifecycle state machine.
- [ ] 02. Enqueue scans instead of running them inside API requests.
- [ ] 03. Implement worker leases, heartbeat and timeouts.
- [ ] 04. Add idempotency keys for webhook and scan requests.
- [ ] 05. Add retry, cancellation and dead-letter handling.
- [ ] 06. Add per-project and global concurrency limits.
- [ ] 07. Add progress events for the UI.
- [ ] 08. Test worker crash and duplicate delivery.
- [ ] 09. Test with a known vulnerable fixture repository.
- [ ] 10. Document scanner execution environment and resource limits.

**Exit:** scan jobs are durable, observable, retryable and do not duplicate unsafe side effects.

## Milestone 7 — Finding intelligence and AutoTriage

- [ ] 01. Implement finding fingerprinting and duplicate detection.
- [ ] 02. Add relationship records without deleting source findings.
- [ ] 03. Add project/asset criticality context.
- [ ] 04. Define transparent deterministic prioritisation factors.
- [ ] 05. Keep raw scanner severity separate from Cyber Sky priority.
- [ ] 06. Define lifecycle states: new, needs-review, validating, confirmed, inconclusive, rejected, fix-proposed, fixed and reopened.
- [ ] 07. Define structured AI output schema with evidence IDs.
- [ ] 08. Add confidence and missing-context fields.
- [ ] 09. Add AI explanation behind a feature flag.
- [ ] 10. Validate AI output and reject unsupported claims.
- [ ] 11. Add user feedback on triage quality.
- [ ] 12. Audit all triage state changes.
- [ ] 13. Test duplicates, conflicts and incomplete evidence.
- [ ] 14. Evaluate against a labelled sample.

**Exit:** every priority has an explainable rationale and source evidence remains accessible.

## Milestone 8 — Model gateway and agent runtime

### Model gateway
- [ ] 01. Define provider-neutral model interface.
- [ ] 02. Implement one local model endpoint adapter.
- [ ] 03. Implement one optional external provider adapter.
- [ ] 04. Make provider selection explicit by organisation/project policy.
- [ ] 05. Add timeouts, retries, token/context limits and concurrency caps.
- [ ] 06. Record model and prompt/configuration versions.
- [ ] 07. Redact secrets and minimise context before inference.
- [ ] 08. Avoid logging sensitive prompts/responses by default.
- [ ] 09. Add provider health checks.
- [ ] 10. Benchmark local inference on available hardware.

### Agents and workflows
- [ ] 11. Define coordinator, finding analyst, validation and remediation roles.
- [ ] 12. Give each agent narrow responsibilities and structured outputs.
- [ ] 13. Define shared state and context lifecycle.
- [ ] 14. Set step, token/compute and wall-clock budgets.
- [ ] 15. Define stop conditions and inconclusive result.
- [ ] 16. Treat repository/tool content as untrusted data.
- [ ] 17. Require policy approval before every tool call.
- [ ] 18. Persist checkpoints and replay metadata.
- [ ] 19. Add deterministic tests with mocked model responses.
- [ ] 20. Add prompt-injection and tool-abuse regression cases.
- [ ] 21. Handle malformed output, provider outage and timeout.
- [ ] 22. Ensure AI failure never suppresses raw scanner findings.

**Exit:** one bounded agent workflow produces structured, evidence-linked analysis through controlled tools.

## Milestone 9 — Validation sandbox and agentic pentest

- [ ] 01. Define supported lab target types and network boundaries.
- [ ] 02. Build disposable container/VM workspace.
- [ ] 03. Restrict outbound network to explicit approved targets.
- [ ] 04. Use non-root identity and least privilege.
- [ ] 05. Apply CPU, memory, process, output and time limits.
- [ ] 06. Create allowlisted tool catalogue with typed schemas.
- [ ] 07. Implement tool gateway authorization and argument validation.
- [ ] 08. Log tool request, policy decision and evidence reference.
- [ ] 09. Verify target authorisation and scope before execution.
- [ ] 10. Create safe validation plans for Juice Shop/DVWA.
- [ ] 11. Capture redacted, reproducible evidence.
- [ ] 12. Return confirmed/likely/inconclusive/not-reproducible/blocked.
- [ ] 13. Add cancellation and manual stop control.
- [ ] 14. Test network restrictions and cleanup.
- [ ] 15. Document sandbox limitations.

**Exit:** tests run only against approved labs, are bounded and produce reproducible evidence.

## Milestone 10 — AutoFix and PR workflow

- [ ] 01. Choose first supported language/framework.
- [ ] 02. Retrieve minimum source context under repository permissions.
- [ ] 03. Generate minimal patch proposal.
- [ ] 04. Store diff and generation metadata.
- [ ] 05. Run formatter, static checks and relevant tests.
- [ ] 06. Run relevant security scanners after patch.
- [ ] 07. Compare before/after findings.
- [ ] 08. Reject unsafe or failing proposals.
- [ ] 09. Present diff, test evidence, assumptions and limitations.
- [ ] 10. Create branch/PR with least-privilege credentials.
- [ ] 11. Require human approval before merge.
- [ ] 12. Record reviewer decision and edits.
- [ ] 13. Add rollback/revert guidance.
- [ ] 14. Measure patch test pass and acceptance rates.

**Exit:** tested patch proposals can be reviewed as PRs; no automatic merge occurs.

## Milestone 11 — Workstation package guard (optional MVP extension)

- [ ] 01. Select one initial OS and package ecosystem (npm or pip).
- [ ] 02. Define package identity, version and source metadata.
- [ ] 03. Integrate advisory and known-malware checks.
- [ ] 04. Select a safe, documented malicious/benign package benchmark.
- [ ] 05. Define allow/warn/block policy.
- [ ] 06. Make interception behaviour transparent.
- [ ] 07. Add explicit override and audit events.
- [ ] 08. Test false positives, false negatives and offline behaviour.
- [ ] 09. Document limits; do not call it full endpoint protection.

**Exit:** limited package screening demo is repeatable and policy-driven. Skip if core workflow is incomplete.

## Milestone 12 — Product UX and integrations

- [ ] 01. Complete project onboarding and integration health.
- [ ] 02. Add scan configuration and policy editor.
- [ ] 03. Add saved finding filters and ownership.
- [ ] 04. Add validation evidence timeline.
- [ ] 05. Add patch review/diff screen.
- [ ] 06. Add job progress, retry and cancellation.
- [ ] 07. Add notifications for completion and critical findings.
- [ ] 08. Add finding/evaluation exports.
- [ ] 09. Complete accessibility and responsive review.
- [ ] 10. Conduct usability testing where participants are available.

**Exit:** primary journey works without database or developer-only CLI intervention.

## Milestone 13 — Desktop and terminal clients (later phase)

### Desktop / Tauri
- [ ] 01. Confirm workflows that genuinely need desktop.
- [ ] 02. Reuse web UI where suitable.
- [ ] 03. Define native permissions and local communication.
- [ ] 04. Secure IPC and local credential storage.
- [ ] 05. Add signed builds and update strategy.
- [ ] 06. Test platform-specific behaviour.

### Terminal / OpenTUI
- [ ] 07. Define command grammar and config format.
- [ ] 08. Implement authentication and project selection.
- [ ] 09. Add scan and finding commands.
- [ ] 10. Add bounded validation with explicit target confirmation.
- [ ] 11. Display plans, tool calls, evidence and policy denials.
- [ ] 12. Add safe non-interactive CI mode.
- [ ] 13. Add completion and docs.
- [ ] 14. Ensure server-side policy remains authoritative.

**Exit:** clients are thin interfaces to shared services. Defer until backend MVP is stable.

## Milestone 14 — Production hardening

### Application security
- [ ] 01. Review architecture threat model against implementation.
- [ ] 02. Run SAST, SCA, secret and container scans on Cyber Sky itself.
- [ ] 03. Review authentication, RBAC and tenant isolation.
- [ ] 04. Test relevant IDOR, SSRF, injection, CSRF and XSS risks.
- [ ] 05. Test prompt-injection and tool-gateway controls.
- [ ] 06. Verify sandbox network and privilege boundaries.
- [ ] 07. Review dependency provenance and lockfiles.
- [ ] 08. Configure TLS, secure headers and session protections.
- [ ] 09. Arrange independent security review if feasible.

### Operations
- [ ] 10. Add structured logs, metrics and distributed tracing.
- [ ] 11. Define service-level objectives for API and jobs.
- [ ] 12. Add queue backpressure and worker limits.
- [ ] 13. Test backup, restore and migration rollback.
- [ ] 14. Test worker crash recovery and duplicate delivery.
- [ ] 15. Alert on failed jobs, backlog and provider outages.
- [ ] 16. Implement retention/deletion jobs.
- [ ] 17. Document incident response and vulnerability disclosure.
- [ ] 18. Create operational runbooks.

### Deployment
- [ ] 19. Build reproducible container images.
- [ ] 20. Run containers non-root; use read-only filesystems where possible.
- [ ] 21. Supply secrets through a secret manager/orchestrator.
- [ ] 22. Configure reverse proxy and TLS.
- [ ] 23. Define staging and production configuration.
- [ ] 24. Add deployment approval and smoke tests.
- [ ] 25. Test rollback and restore in staging.
- [ ] 26. Document upgrade procedure and supported topology.

**Exit:** deployment is repeatable, monitored, recoverable and has passed a documented security review appropriate to its maturity.

## Milestone 15 — Evaluation and academic evidence

- [ ] 01. Freeze benchmark dataset and record provenance/licensing.
- [ ] 02. Define ground-truth labels and labelling process.
- [ ] 03. Record scanner versions, rules and configuration.
- [ ] 04. Record model, prompt and agent configuration versions.
- [ ] 05. Run baseline scanners without AI.
- [ ] 06. Run scanner + validation + triage workflow.
- [ ] 07. Calculate precision, recall, false-positive reduction and false-negative rate.
- [ ] 08. Run AutoFix experiments and calculate test pass rate.
- [ ] 09. Measure CI overhead over repeated runs.
- [ ] 10. Measure local inference latency and resource consumption.
- [ ] 11. Analyse failure cases and unexpected results.
- [ ] 12. Document limitations and threats to validity.
- [ ] 13. Preserve reproducible logs and anonymised results.
- [ ] 14. Map results to research question and objectives.
- [ ] 15. Prepare demo script and backup recording.

**Exit:** every performance claim is supported by reproducible measurements.

## Milestone 16 — Commercial validation

- [ ] 01. Research competitors and substitute tools.
- [ ] 02. Interview potential users and validate pain points.
- [ ] 03. Complete lean/business model canvas.
- [ ] 04. Define first target segment and use case.
- [ ] 05. Validate willingness to pay and procurement concerns.
- [ ] 06. Estimate self-hosted and managed deployment costs.
- [ ] 07. Define licensing and packaging options.
- [ ] 08. Prepare privacy/data-flow documentation.
- [ ] 09. Prepare pilot scope and authorised testing agreement.
- [ ] 10. Define support and disclosure process.
- [ ] 11. Prepare product pitch and demonstration.
- [ ] 12. Create post-FYP roadmap based on evidence.

**Exit:** commercial assumptions and pilot proposal are documented, not merely inferred.

## Milestone 17 — Release and ongoing operations

- [ ] 01. Choose alpha/private beta/general availability channel.
- [ ] 02. Publish versioned release notes.
- [ ] 03. Publish install, upgrade and backup documentation.
- [ ] 04. Publish supported integrations and limitations.
- [ ] 05. Provide security contact and responsible disclosure route.
- [ ] 06. Monitor errors, performance and security events.
- [ ] 07. Triage user feedback and vulnerabilities.
- [ ] 08. Maintain dependency/container update cadence.
- [ ] 09. Review permissions and secrets periodically.
- [ ] 10. Exercise disaster recovery and incident response.
- [ ] 11. Prioritise roadmap from customer evidence.

**Exit:** controlled release process, monitoring, support, maintenance and feedback loop exist.

---

## Critical path — recommended build order

1. Product scope and threat model.
2. Repository, CI and local environment.
3. Backend, database, identity and project model.
4. Scanner adapters and durable jobs.
5. Normalised findings and basic web UI.
6. Model gateway and evidence-based AutoTriage.
7. Bounded validation sandbox and one agent workflow.
8. AutoFix proposal, tests and human-reviewed PR.
9. Evaluation, security hardening and final demonstration.
10. Optional workstation proof, desktop and terminal clients.

Do not begin with Kubernetes, Kafka, multi-cloud CSPM, runtime prevention or full desktop/terminal experiences before the critical path works.

## Two-week sprint template

- **Sprint goal:**
- **User-visible outcome:**
- **Issues/tasks:**
- **Acceptance criteria:**
- **Security/privacy impact:**
- **Tests and benchmark cases:**
- **Demo evidence:**
- **Risks/blockers:**
- **Learning and next changes:**

## Pull request checklist

- [ ] Scope is focused and linked to a task.
- [ ] Tests added/updated; type-check, lint and build pass.
- [ ] No secrets or sensitive sample data committed.
- [ ] Tenant boundaries and authorisation considered.
- [ ] Logs do not expose secrets or unnecessary source data.
- [ ] Agent/tool permissions are explicit and bounded.
- [ ] Failure, timeout, retry and cancellation paths considered.
- [ ] Documentation and ADR updated.
- [ ] Reviewer can reproduce the behaviour.

## Release checklist

- [ ] Version and release notes prepared.
- [ ] Migrations tested and backups verified.
- [ ] Security scans pass or exceptions documented.
- [ ] Secrets and environment variables reviewed.
- [ ] Staging smoke tests pass.
- [ ] Rollback plan tested.
- [ ] Monitoring and alerting active.
- [ ] Known limitations published.
