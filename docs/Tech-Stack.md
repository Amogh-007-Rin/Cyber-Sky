# CYBER SKY — Technology Stack

> Proposed stack by product surface and subsystem, with responsibilities, rationale and decision status.
>
> **Status:** Proposed baseline. Validate through small technical spikes and Architecture Decision Records (ADRs). The project owner has identified these preferences; not every technology should be adopted automatically.

## 1. Stack principles

- Prefer a small, coherent stack over technology accumulation.
- Reuse mature security tools rather than rebuild detection engines.
- Keep AI provider-specific code behind an adapter.
- Use PostgreSQL as the default source of truth.
- Add MongoDB, Kafka, Rust, Go or Kubernetes only when a demonstrated requirement justifies the cost.
- Keep core development runnable on modest hardware.
- Isolate scanners and agent execution from the control plane.
- Treat local/self-hosted inference as a first-class mode.

## 2. Website client

| Layer | Proposed technology | Responsibility |
|---|---|---|
| Framework | Next.js + React | Main web control plane |
| Language | TypeScript | Type-safe UI and API contracts |
| Runtime/package manager | Bun where compatible | Development and package scripts |
| Styling | Tailwind CSS | Consistent utility styling |
| Components | shadcn/ui + Radix UI | Accessible, composable components |
| Icons | Lucide | Consistent icon set |
| Forms | React Hook Form + Zod | Form state and validation |
| Data fetching | TanStack Query or Next.js server patterns | Cache, loading and mutations |
| Tables | TanStack Table | Findings, scans and project grids |
| Charts | Recharts or equivalent | Trends and evaluation metrics |
| Motion | Framer Motion, selectively | Restrained transitions |
| Authentication | Auth.js or backend-managed sessions | Browser identity |
| API client | Generated OpenAPI client / typed fetch | Backend contract |
| Testing | Vitest, React Testing Library, Playwright | Unit, component and browser tests |

**Why:** Next.js has a mature React ecosystem for dashboards and server-rendered pages. TypeScript and schema validation reduce integration errors. shadcn/ui allows control over component source and design.

**Boundary:** frontend visibility is not authorization. The backend must enforce all permissions.

## 3. Desktop client

| Layer | Proposed technology | Responsibility |
|---|---|---|
| Shell | Tauri v2 | Native desktop wrapper |
| UI | Reused React components or dedicated Vite React app | Shared experience |
| Native backend | Rust / Tauri commands | OS integration |
| Local communication | Authenticated localhost IPC/API | Local service interaction |
| Credential storage | OS keychain through vetted plugin | Secure token storage |
| Packaging | Tauri bundler and platform signing | Installers and updates |

**Why:** Tauri can produce a lightweight desktop application and Rust provides a controlled native boundary.

**Security requirements:** narrow IPC surface, validate every command, restrict filesystem access, protect local ports and sign release artefacts. Desktop is a later phase, not a prerequisite for the FYP MVP.

## 4. Terminal agent / TUI client

| Layer | Proposed technology | Responsibility |
|---|---|---|
| Runtime | Bun | TypeScript runtime |
| Language | TypeScript | Shared schemas and client logic |
| TUI | OpenTUI | Interactive terminal interface |
| CLI parsing | Commander or small typed parser | Commands and flags |
| Validation | Zod | Config and argument validation |
| API | Shared generated client | Backend communication |
| Streaming | WebSocket or SSE | Job progress and agent events |
| Packaging | Bun executable / platform packaging | Distribution |

**Why:** security engineers and developers often prefer terminal workflows. The CLI should remain a thin client over the same backend policy and service layer.

**Safety:** explicit target scope, visible planned actions, server-side policy enforcement and non-intrusive defaults.

## 5. Backend and API

| Element | Proposed technology | Responsibility |
|---|---|---|
| Runtime | Bun | TypeScript execution |
| Language | TypeScript | Shared contracts |
| HTTP framework | Hono **or** Elysia | REST and middleware |
| Validation | Zod or TypeBox | Request/response schemas |
| API documentation | OpenAPI | Contracts and client generation |
| Realtime | Framework-supported WebSocket/SSE | Job updates |
| Logging | Pino or structured logger | JSON logs and correlation IDs |
| Testing | Bun test / Vitest | Unit and integration |

**Hono vs Elysia:** build a small spike comparing ecosystem compatibility, type inference, middleware, OpenAPI, WebSockets and deployment. Choose one and record an ADR. Avoid using both in the same core API without a clear service boundary.

### Backend domain modules
- Identity and organisation.
- Projects and repository integrations.
- Scanner configuration and orchestration.
- Findings and evidence.
- AI model gateway.
- Agent workflow orchestration.
- Validation and sandbox control.
- AutoTriage.
- AutoFix and pull requests.
- Policy, audit, notifications and reporting.

Start as a modular backend; split services only when independent deployment, scaling or isolation warrants it.

## 6. Database and storage

### PostgreSQL + Prisma
- **PostgreSQL:** primary relational source of truth for users, organisations, projects, scans, findings, policies and audit metadata.
- **Prisma:** typed data access and migrations.
- **Zod/generated types:** runtime contract validation.
- **PostgreSQL indexes/full-text search:** initial finding and project search.

**Why:** the core domain is relational and benefits from transactions, constraints and tenant scoping. JSONB can hold selected flexible scanner metadata.

### MongoDB + Mongoose — conditional
Not part of the default stack. Add only if a measured document workload cannot be handled appropriately by PostgreSQL JSONB or object storage. A second database creates consistency and operational costs.

### Object/artifact storage
- S3-compatible object storage for raw reports, evidence, traces, patch artefacts and exports.
- MinIO or local storage for development.
- Store object references and checksums in PostgreSQL.
- Encrypt sensitive artefacts, restrict access and apply retention.
- Never place secrets in object metadata or logs.

### Graph capability
Start with relational links and recursive PostgreSQL queries for finding relationships. Add a graph database only if attack-path/dependency queries become central and performance evidence justifies it.

## 7. Background processing

| Element | Proposed technology | Responsibility |
|---|---|---|
| Queue/cache | Redis | Job dispatch, short-lived state, rate limits and cache |
| Worker runtime | Bun/TypeScript initially | Integration and orchestration jobs |
| Workflow engine | LangGraph or explicit durable state machine | Multi-step agent workflows |
| Event streaming | Kafka only if justified | High-volume durable event distribution later |

**Why Redis first:** it is operationally lighter for the initial workload. Kafka adds cluster and operational complexity; adopt it only when throughput, replay or multiple independent consumers require it.

Queue messages should contain identifiers/references, not source bundles or secrets. Workers need idempotency, retry, timeout, cancellation and durable state.

## 8. AI and agentic layer

### Model gateway
- Provider-neutral TypeScript interface.
- Local model endpoint adapter.
- Optional external provider adapters.
- Explicit provider selection per organisation/project policy.
- Timeouts, retries, context/token budgets and concurrency limits.
- Model and prompt/configuration version tracking.
- Redaction and data minimisation before inference.

Potential SDKs:
- Google AI SDK and/or Vercel AI SDK for model access and streaming.
- Provider-specific SDKs behind adapters.
- OpenAI-compatible local endpoints where supported.

Do not couple business logic to one vendor's response format.

### Agent orchestration
**LangGraph** is a candidate for stateful workflows, checkpointing and explicit graph transitions. A deterministic state machine may be simpler for early MVP flows.

Agent roles:
- Coordinator/planner.
- Finding analyst.
- Validation agent.
- Remediation agent.

Each agent needs a narrow role, structured output, bounded tools, maximum steps and explicit stop conditions. The model proposes; the policy layer authorises.

### Local inference runtimes
Potential options:
- **Ollama:** convenient local development and model serving.
- **vLLM:** higher-throughput GPU serving where hardware supports it.
- **llama.cpp:** CPU/quantised or constrained deployments.
- Other runtimes may be benchmarked.

Selection criteria:
- Security-task quality.
- Hardware/memory needs.
- Latency and concurrency.
- Structured output/tool-calling reliability.
- Model licence and commercial-use terms.
- Telemetry/data-retention behaviour.
- Ease of customer deployment.

The project notes identify an Oracle server with 2 OCPU and 12 GB RAM. Treat it as suitable for lightweight services and integration tests, not guaranteed capacity for large local models or concurrent scans. Use a workstation or additional compute for demanding inference.

## 9. Security scanning and sandboxing

| Capability | Candidate | Purpose |
|---|---|---|
| SAST | Semgrep | Source-code rules and patterns |
| DAST | OWASP ZAP | Dynamic tests of authorised lab/staging targets |
| SCA/container/filesystem/IaC | Trivy | Dependencies, images and configuration |
| Secret scanning | Gitleaks | Exposed secrets |
| Additional scanner | To be selected | Close a documented coverage gap |

Cyber Sky integrates these tools through adapters. Pin versions, preserve raw output, test parsers with fixtures and record configuration.

### Sandbox technology
- Docker containers for initial isolation.
- Dedicated worker identity and least privilege.
- No privileged containers by default.
- Read-only root filesystem where practical.
- Network allowlists and egress restrictions.
- CPU/memory/process/time limits.
- Ephemeral workspaces and cleanup.
- Consider VM/microVM isolation for higher-risk workloads.

Docker is useful packaging and isolation, but is not a complete boundary for every hostile workload.

## 10. Infrastructure and deployment

### Development
- Docker Compose for PostgreSQL, Redis, local object store and optional model service.
- Validated environment configuration and `.env.example`.
- One-command setup, migrations and seed data.
- Intentionally vulnerable lab targets.
- CI on every pull request.

### Early self-hosted deployment
A documented single-node Docker deployment may be sufficient for early pilots. Include health checks, persistent volumes, backups, upgrade and rollback instructions.

### Scaled deployment
Kubernetes is a later option when multi-node scheduling, availability, isolation or scaling needs justify its operational overhead.

Potential components:
- Reverse proxy/ingress: Caddy, Traefik or NGINX.
- TLS certificates.
- Web and API containers.
- Worker containers.
- PostgreSQL and Redis.
- S3-compatible object storage.
- Local model service when enabled.
- Metrics/logging stack.

## 11. Authentication, authorization and secrets

- Auth.js may support web sign-in; backend authorization remains authoritative.
- Prefer secure server-managed browser sessions where appropriate.
- Use JWTs only for defined API/service use cases, with short lifetimes and rotation.
- RBAC plus organisation/project scope.
- Store OAuth tokens encrypted or in a secret manager.
- Keep local secrets out of version control.
- Supply production secrets via secret manager/orchestrator.
- Audit permission changes and privileged actions.

## 12. Observability

- Structured JSON logs.
- OpenTelemetry instrumentation.
- Prometheus-compatible metrics.
- Grafana dashboards where appropriate.
- Error tracking, self-hosted or selected provider.
- Correlation IDs across API request, job, scan and agent run.

Do not log raw source, credentials, full prompts or sensitive scanner output by default.

## 13. Testing stack

| Test type | Candidate |
|---|---|
| Unit | Bun test / Vitest |
| API integration | Vitest/Bun test + test database |
| UI components | React Testing Library |
| Browser E2E | Playwright |
| Contracts | OpenAPI/schema validation |
| Scanner adapters | Fixture-based parser tests |
| Security | Semgrep, Trivy, Gitleaks, ZAP in authorised lab |
| Load | k6 or equivalent |
| Agent evaluation | Versioned benchmark + deterministic mocked tool/model tests |

## 14. Proposed monorepo structure

```text
cyber-sky/
├── apps/
│   ├── web/                 # Next.js control plane
│   ├── desktop/             # Tauri shell (later)
│   └── terminal/            # Bun + OpenTUI (later)
├── services/
│   ├── api/                 # HTTP API / modular control plane
│   ├── worker/              # Background jobs
│   ├── scanner-runner/      # Scanner adapters
│   ├── agent-runtime/       # Agent workflows and model gateway
│   └── sandbox-controller/  # Isolated execution lifecycle
├── packages/
│   ├── contracts/           # Shared schemas/API types
│   ├── database/            # Prisma schema and migrations
│   ├── config/              # Shared configuration
│   ├── logger/              # Logging/tracing
│   ├── scanner-sdk/         # Scanner adapter interfaces
│   ├── ai-sdk/              # Provider-neutral interfaces
│   ├── policy/              # Permission evaluation
│   ├── ui/                  # Shared UI components
│   └── test-kit/            # Fixtures and test helpers
├── infrastructure/
│   ├── compose/
│   ├── docker/
│   ├── deployment/
│   └── observability/
├── docs/
│   ├── adr/
│   ├── security/
│   ├── runbooks/
│   └── evaluation/
├── scripts/
├── .github/workflows/
├── Project.md
├── Execution.md
├── Tech-Stack.md
├── System-Architecture.md
└── README.md
```

This is a target layout. Create directories as modules are implemented; do not create empty services just to match the diagram.

## 15. Decision register

| Decision | Current position | Revisit when |
|---|---|---|
| API framework | Hono or Elysia; decide by spike | Compatibility/performance evidence |
| Database | PostgreSQL + Prisma | Document/graph workload demonstrated |
| Queue | Redis first | Durable replay/high-scale needs |
| Kafka | Deferred | High-volume multi-consumer events |
| AI orchestration | LangGraph or state machine | Workflow complexity warrants it |
| Local inference | Choose by benchmark | Customer hardware/quality requirements |
| Services | Modular monolith initially | Independent scaling/deployment need |
| Kubernetes | Deferred for early deployment | Multi-node/availability requirements |
| Rust/Go | Selective only | Profiling shows need |

## 16. Technology adoption checklist

Before adding a technology:
- [ ] Does it solve a documented requirement?
- [ ] Is it compatible with self-hosted deployment?
- [ ] What operational burden does it add?
- [ ] Is it maintained and appropriately licensed?
- [ ] Can it be tested and monitored?
- [ ] Is there a simpler alternative?
- [ ] Is there a migration/exit path?
- [ ] Is the choice recorded in an ADR?
