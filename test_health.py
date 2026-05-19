import urllib.request
import json

try:
    req = urllib.request.Request("http://localhost:8001/health")
    with urllib.request.urlopen(req) as response:
        print("Backend Status:", response.status)
        print("Response:", response.read().decode())
except Exception as e:
    print("Health Check Failed:", str(e))
