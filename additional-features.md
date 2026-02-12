# 🚀 Cyber Sky: Extended Security Features

## 1. Honeytoken Deception (PS3 + PS1)
- **Concept**: Inject "decoy" system secrets into the LLM context.
- **Logic**: If the Sentinel Engine detects these specific strings in the AI's output, it triggers a 'CRITICAL' Data Exfiltration incident.
- **Impact**: Provides 100% deterministic proof of a successful prompt injection override.

## 2. Graph-Based Lateral Movement (PS1)
- **Concept**: A visual map connecting Source IPs to multiple affected assets.
- **Logic**: Uses a graph database or NetworkX to link isolated logs (e.g., login from IP-A to Server-1, followed by a scan from Server-1 to Server-2).
- **Impact**: Visualizes the "Attack Narrative" beyond a simple list.

## 3. Automated Remediation Playbooks (PS1)
- **Concept**: AI-generated "Next Steps" for SOC analysts.
- **Logic**: For every correlated incident, the LLM suggests specific API-driven actions (e.g., "Revoke JWT", "Blacklist IP", "Reset 2FA").
- **Impact**: Demonstrates rapid investigation and response capabilities.

## 4. Multi-Agent Consensus Scoring (PS3)
- **Concept**: A "Voting" system for classification.
- **Logic**: Uses a fast RegEx/Keyword matcher and a slower Transformer-based model. If they disagree, the risk score is boosted to 'Suspicious' for human review.
- **Impact**: Reduces "Alert Fatigue" and increases detection defensibility.

## 5. PII Output Redaction (PS3)
- **Concept**: Egress filtering.
- **Logic**: Scans model responses for patterns matching PII (Email, API Keys, SSNs) before the user sees them.
- **Impact**: Prevents unintentional data leakage from the model.