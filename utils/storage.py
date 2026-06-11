import json
import os
from typing import List

DATA_DIR = "data/sessions"


def get_session_file(session_id: str) -> str:
    os.makedirs(DATA_DIR, exist_ok=True)
    # Sanitise session_id to prevent path traversal
    safe_id = "".join(c for c in session_id if c.isalnum() or c == "-")
    return os.path.join(DATA_DIR, f"{safe_id}.json")


def load_applications(session_id: str) -> List[dict]:
    filepath = get_session_file(session_id)
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r") as f:
        return json.load(f)


def save_applications(session_id: str, applications: List[dict]) -> None:
    filepath = get_session_file(session_id)
    with open(filepath, "w") as f:
        json.dump(applications, f, indent=2)