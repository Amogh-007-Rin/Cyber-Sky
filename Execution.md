Phase 1: High-Fidelity Architecture
You are building two distinct but unified engines:

The Sentinel Engine (FastAPI): An asynchronous ML service for real-time prompt classification and log-based root cause analysis.

The Command Center (Express/React): A high-throughput orchestration layer and a sophisticated "Bento-grid" style dashboard for security analysts.

Phase 2: Detailed Implementation Steps
Step 1: Core Service Contracts (The "Production" Foundation)
Agent Prompt:

"Initialize a monorepo for 'Cyber Sky'.

Backend (Express): Setup a TypeScript server with Helmet.js and CORS configured for strict production standards.

Database (Prisma): Create a robust schema. Use Enums for Severity (LOW, MEDIUM, HIGH, CRITICAL) and Decision (ALLOW, BLOCK, FLAG).

FastAPI: Use Pydantic V2 to define the SecurityContract. Every prompt validation must return a ConfidenceScore and Reasoning.

Auth: Implement JWT-based authentication for the dashboard."

Step 2: Advanced AI Prompt Defense (Problem 3)
To make this "production-grade," we use Prompt Fencing and Embedding Similarity. Agent Prompt:

"In the FastAPI service, implement the SentinelGuard:

Prompt Fencing: Wrap inputs in cryptographically signed boundaries to prevent data leakage.

Similarity Detection: Use sentence-transformers (all-MiniLM-L6-v2) to compare incoming prompts against a vector store of known jailbreaks.

Detection Rules: Detect hidden instruction overrides and attempts to exfiltrate system configuration.

Action Logic: If classification is 'Malicious', return a BLOCK decision with a detailed reasoning string (e.g., 'Tactic: System Prompt Leakage detected')."

Step 3: Intelligent Log Correlation & MITRE Mapping (Problem 1)
Agent Prompt:

"Build the CorrelationCore in the Express backend:

Ingestion: Create a worker to process JSON/CSV logs.

Correlation Logic: Implement a time-window sliding algorithm. If 5+ failed logins (eventType: LOGIN_FAIL) occur from one IP within 15 minutes, followed by a successful login, flag as Incident: Brute Force Success.

MITRE Mapping: Automatically map these incidents to MITRE ATT&CK techniques (e.g., T1110 for Brute Force).

AI Summary: Send the correlated log group to the FastAPI /summarize endpoint to generate a plain-English explanation for the dashboard."

Step 4: The "Cyber Sky" Dashboard (Frontend)
Agent Prompt:

"Build a production-grade UI using React and shadcn/ui:

Live Threat Map: Use React Flow or D3.js to visualize the relationship between malicious IPs and affected assets.

AI Sandbox: Create a side-by-side terminal. User inputs go on the left; the 'Cyber Sky' middleware defense steps (Scoring, Sanitization, Decision) appear on the right in real-time.

Incident Timeline: A vertical, interactive timeline showing the sequence of a detected attack."

Phase 3: The "Judge-Winning" Advanced Features
To elevate this above a standard MVP, ensure the agent adds these:

Adaptive Risk Thresholds: A slider in the UI that adjusts the FastAPI sensitivity (e.g., lower the cosine similarity threshold for 'High Security' mode).

Output Filtering: Don't just check inputs; scan the AI's output for sensitive keywords or PII leakage before it reaches the user.

Red-Team Simulation: A 'Simulation Mode' that generates synthetic malicious logs to show the platform's detection capabilities live.