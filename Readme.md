Cyber Sky
=========
🛰️🛡️🔎

![Stack](https://img.shields.io/badge/stack-React%20%7C%20Express%20%7C%20FastAPI-0ea5e9)
![DB](https://img.shields.io/badge/db-PostgreSQL-3b82f6)
![AI](https://img.shields.io/badge/AI-Sentinel%20Engine-f97316)

Cyber Sky is a full-stack cybersecurity command center for real-time log ingestion, AI-assisted incident correlation, and analyst-facing visualizations. It combines a TypeScript/Express orchestration server, a React dashboard, and a FastAPI-based AI engine that performs prompt defense, log analysis, and remediation guidance.

Table of contents
-----------------
- Overview
- Architecture
- Tech stack
- Project structure
- API routes
- Environment variables
- Setup and run
- Data model
- Security notes
- Troubleshooting

Overview
--------
⚡ Key features
- 🧠 AI-assisted incident summaries and remediation playbooks.
- 🛰️ Real-time log ingestion and correlation (brute force, SQLi, DDoS, prompt injection).
- 🧪 AI sandbox for safe prompt testing and DLP checks.
- 🗺️ Visual dashboard for threats, timelines, and incidents.
Cyber Sky focuses on:
- Real-time log ingestion and correlation (brute force, SQLi, DDoS, prompt injection, honeytoken exfiltration).
- AI summaries and remediation playbooks for correlated incidents.
- A responsive dashboard for live visibility, incident timelines, and AI sandbox testing.

Architecture
------------
🏗️ Services
Three services are intended to run together:
1) Client (React + Vite) - analyst dashboard UI.
2) Server (Express + Prisma) - API, correlation logic, and persistence.
3) AI Engine (FastAPI) - prompt defense and AI summaries/playbooks.

High-level flow:
1) Logs are posted to the server at /api/v1/logs.
2) CorrelationService evaluates patterns and opens incidents.
3) The AI Engine generates summaries and remediation steps.
4) The dashboard visualizes logs and incidents.

Tech stack
----------
🧰 Tooling
Frontend:
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion, Recharts, React Router

Backend:
- Node.js + Express 5
- Prisma ORM + PostgreSQL
- JWT auth, bcrypt

AI Engine:
- FastAPI
- sentence-transformers (local similarity model)
- Google Gemini (optional, for deep analysis)

Project structure
-----------------
🧭 Monorepo layout
.
├─ AI-Engine/
│  ├─ app.py
│  └─ requirements.txt
├─ client/
│  ├─ src/
│  │  ├─ api.ts
│  │  ├─ components/
│  │  └─ pages/
│  └─ package.json
├─ server/
│  ├─ prisma/
│  │  └─ schema.prisma
│  ├─ src/
│  │  ├─ index.ts
│  │  ├─ lib/prisma.ts
│  │  ├─ routes/
│  │  └─ services/
│  └─ package.json
├─ Execution.md
└─ additional-features.md

API routes
----------
🧩 Endpoints
Server base URL: http://localhost:3000

Health
- GET /server/test
	- Returns a simple JSON response to confirm the server is running.

Users
- POST /api/v1/users/signup
	- Create a user. Body: { fullName, email, password }
- POST /api/v1/users/login
	- Login. Body: { email, password }
- GET /api/v1/users/listusers
	- List users (id, fullName, email).

Logs and incidents
- POST /api/v1/logs
	- Ingest a log. Body: { ip, eventType, details? }
- GET /api/v1/logs
	- Fetch recent logs (latest 50).
- GET /api/v1/logs/export
	- Download all logs as JSON.
- GET /api/v1/logs/incidents
	- Fetch incidents with linked logs.
- DELETE /api/v1/logs/incidents
	- Clear all incidents (demo reset).

AI Engine base URL: http://localhost:8000

Health
- GET /
	- Returns AI engine status and model availability.

Prompt defense
- POST /analyze
	- Analyze a prompt. Body: { prompt, user_id? }
	- Returns: { decision, confidence_score, reasoning, consensus_note? }

Log analysis
- POST /summarize
	- Generate a summary and remediation steps for incident logs.
	- Body: { logs: [{ timestamp, eventType, details }], incidentType }

Dataset analysis (Gemini required)
- POST /analyze-logs
	- Upload a log file for AI-assisted threat analysis.

AI response DLP (Gemini required)
- POST /simulate_chat
	- Simulates an AI response and runs DLP and honeytoken checks.

Environment variables
---------------------
🔐 Configuration
Server (server/.env):
- PORT: API port (default 3000)
- DATABASE_URL: PostgreSQL connection string
- JWT_SECRET: JWT signing secret
- CLIENT_URL: allowed CORS origin (default http://localhost:5173)
- AI_ENGINE_URL: FastAPI base URL (default http://localhost:8000)

AI Engine (AI-Engine/.env):
- GEMINI_API_KEY: enables Gemini features (optional)
- SERVER_URL: server base URL for incident reporting (default http://localhost:3000)

Client:
- No required env vars. API URLs are set in client/src/api.ts.

Setup and run
-------------
🚀 Local setup
1) Install dependencies
- Client:
	- cd client
	- npm install
- Server:
	- cd server
	- npm install
- AI Engine:
	- cd AI-Engine
	- pip install -r requirements.txt

2) Configure database
- Create a PostgreSQL database and set DATABASE_URL in server/.env.
- Run Prisma migrations:
	- cd server
	- npx prisma migrate dev

3) Start services (in separate terminals)
- AI Engine:
	- cd AI-Engine
	- python app.py
- Server:
	- cd server
	- npm run dev
- Client:
	- cd client
	- npm run dev

Data model
----------
🗃️ Core entities
Defined in server/prisma/schema.prisma.
- User: id, fullName, email, password, createdAt
- Log: id, ip, eventType, timestamp, details
- Incident: title, description, severity, decision, mitreTechnique, remediationSteps, createdAt, logs

Security notes
--------------
🛡️ Defense-in-depth
- JWT is used for authentication (signup/login).
- Helmet and CORS are enabled by default in the server.
- AI Engine includes multi-layer prompt defense: regex checks, semantic similarity, and Gemini (when available).
- Honeytoken detection and DLP filtering are used to flag exfiltration.

Troubleshooting
---------------
🧯 Common fixes
- If AI summaries are empty, ensure AI Engine is running and AI_ENGINE_URL is correct.
- If Gemini features are disabled, set GEMINI_API_KEY and restart AI Engine.
- If CORS fails, ensure CLIENT_URL matches your frontend origin.

Notes
-----
📎 References
- Execution.md and additional-features.md describe the intended feature roadmap and extended capabilities.
