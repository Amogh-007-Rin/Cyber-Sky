
import requests
import json
import io

API_URL = "http://localhost:8000/analyze-logs"

# Sample JSON log
log_data = [
    {"timestamp": "2024-02-12T10:00:00Z", "ip": "192.168.1.100", "event": "LOGIN_SUCCESS", "user": "admin"},
    {"timestamp": "2024-02-12T10:05:00Z", "ip": "10.0.0.5", "event": "SQL_INJECTION_ATTEMPT", "query": "SELECT * FROM users WHERE 1=1"}
]

json_content = json.dumps(log_data)
files = {'file': ('logs.json', json_content, 'application/json')}

try:
    print("Testing /analyze-logs with JSON...")
    response = requests.post(API_URL, files=files)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("Success! Analysis:", response.json().get("analysis")[:100] + "...")
    else:
        print("Error:", response.text)
except Exception as e:
    print(f"Request failed: {e}")
