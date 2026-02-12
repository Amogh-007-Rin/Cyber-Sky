# 🛰️ Cyber Sky

> **A Full-Stack AI-Powered Cybersecurity Command Center**

![Stack](https://img.shields.io/badge/stack-React%20%7C%20Express%20%7C%20FastAPI-0ea5e9?style=for-the-badge)
![DB](https://img.shields.io/badge/db-PostgreSQL-3b82f6?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Sentinel%20Engine-f97316?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**Cyber Sky** is a next-generation security dashboard designed for real-time log ingestion, AI-assisted incident correlation, and proactive threat mitigation. It combines a high-performance **Node.js/Express** orchestration server, a sleek **React** dashboard, and a **FastAPI** AI engine powered by **Google Gemini**.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)

---

## 🔭 Overview

Cyber Sky provides a unified interface for security analysts to monitor, analyze, and respond to threats in real-time.

### ⚡ Key Features

- **🧠 AI-Assisted Intelligence**: Automated incident summaries and actionable remediation playbooks using Gemini LLM.
- **🛰️ Real-Time Monitoring**: Live ingestion and correlation of logs to detect Brute Force, SQL Injection, DDoS, and Prompt Injection attacks.
- **🧪 AI Sandbox**: A safe environment for testing prompts and validating DLP (Data Loss Prevention) rules.
- **🛡️ Server-Safe**: Upload and analyze server logs (CSV/JSON) for vulnerability assessment.
- **🗺️ Visual Dashboard**: Interactive timelines, threat maps, and incident status tracking.

---

## 🏗️ Architecture

The system consists of three microservices working in harmony:

1.  **Client (Frontend)**: A React + Vite dashboard for analysts.
2.  **Server (Backend)**: Express + Prisma API for data aggregation and logic.
3.  **AI Engine (ML Service)**: FastAPI service for prompt defense, log analysis, and LLM integration.

### High-Level Data Flow

1.  **Ingest**: Logs are posted to `/api/v1/logs`.
2.  **Correlate**: The Server evaluates patterns and triggers Incidents.
3.  **Analyze**: The AI Engine generates summaries and defense strategies.
4.  **Visualize**: The Dashboard presents real-time data to the analyst.

---

## 🛠️ Tech Stack

### Frontend
-   ⚛️ **React 19** + **TypeScript**
-   ⚡ **Vite** for fast build tooling
-   🎨 **Tailwind CSS** for styling
-   ✨ **Framer Motion** for animations
-   📊 **Recharts** for data visualization

### Backend
-   🟢 **Node.js** + **Express 5**
-   🐘 **Prisma ORM** + **PostgreSQL**
-   🔐 **JWT** & **Bcrypt** for security

### AI Engine
-   🐍 **FastAPI** (Python)
-   🧠 **Google Gemini** (LLM)
-   🔎 **Sentence-Transformers** (Local embeddings)

---

## 🧭 Project Structure

```text
.
├── AI-Engine/           # Python FastAPI Service
│   ├── app.py           # Main application entry point
│   └── requirements.txt # Python dependencies
├── client/              # React Frontend
│   ├── src/
│   │   ├── api.ts       # API integration
│   │   ├── components/  # UI Components
│   │   └── pages/       # Route Pages
│   └── package.json
├── server/              # Express Backend
│   ├── prisma/          # Database Schema
│   ├── src/
│   │   ├── routes/      # API Routes
│   │   └── services/    # Business Logic
│   └── package.json
└── README.md            # Project Documentation
```

---

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   Python (v3.9+)
-   PostgreSQL

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/cyber-sky.git
    cd cyber-sky
    ```

2.  **Install Dependencies**

    *Client:*
    ```bash
    cd client
    npm install
    ```

    *Server:*
    ```bash
    cd ../server
    npm install
    ```

    *AI Engine:*
    ```bash
    cd ../AI-Engine
    pip install -r requirements.txt
    ```

3.  **Database Setup**
    Create a PostgreSQL database and configure your `.env` file in the `server` directory.
    ```bash
    cd server
    npx prisma migrate dev
    ```

4.  **Start Services** (Run in separate terminals)

    *Terminal 1 - AI Engine:*
    ```bash
    cd AI-Engine
    python app.py
    ```

    *Terminal 2 - Server:*
    ```bash
    cd server
    npm run dev
    ```

    *Terminal 3 - Client:*
    ```bash
    cd client
    npm run dev
    ```

---

## 🧩 API Documentation

### Server (`http://localhost:3000`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/v1/users/login` | Authenticate user |
| **POST** | `/api/v1/logs` | Ingest a new security log |
| **GET** | `/api/v1/logs` | Fetch recent logs |
| **GET** | `/api/v1/logs/incidents` | Get correlated incidents |
| **DELETE** | `/api/v1/logs/incidents` | Clear all incidents (Demo) |

### AI Engine (`http://localhost:8000`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/analyze` | Analyze prompt for injection attacks |
| **POST** | `/summarize` | Generate incident summary |
| **POST** | `/analyze-logs` | Upload log file for deep analysis |

---

## 🔐 Environment Variables

### Server (`server/.env`)
```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/cybersky"
JWT_SECRET="your_secret_key"
CLIENT_URL="http://localhost:5173"
AI_ENGINE_URL="http://localhost:8000"
```

### AI Engine (`AI-Engine/.env`)
```env
GEMINI_API_KEY="your_gemini_api_key"
SERVER_URL="http://localhost:3000"
```

---

## 🧯 Troubleshooting

-   **Empty AI Summaries?** Ensure the AI Engine is running on port 8000 and the `AI_ENGINE_URL` is set correctly in the server `.env`.
-   **Gemini Features Disabled?** You need a valid `GEMINI_API_KEY` in `AI-Engine/.env`.
-   **CORS Errors?** Check that `CLIENT_URL` in `server/.env` matches your frontend URL.

---

> Built with ❤️ for the Hackathon
