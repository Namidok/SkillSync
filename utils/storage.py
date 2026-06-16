"""
Supabase PostgreSQL storage — replaces JSON file storage.
Each user's data is isolated via Row Level Security.
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

def get_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def load_applications(user_id: str):
    client = get_client()
    res = client.table("applications").select("*").eq("user_id", user_id).order("created_at").execute()
    return res.data or []


def save_application(user_id: str, app_data: dict):
    client = get_client()
    app_data["user_id"] = user_id
    res = client.table("applications").insert(app_data).execute()
    return res.data[0] if res.data else None


def update_application(user_id: str, app_id: int, updates: dict):
    client = get_client()
    res = client.table("applications").update(updates).eq("id", app_id).eq("user_id", user_id).execute()
    return res.data[0] if res.data else None


def delete_application(user_id: str, app_id: int):
    client = get_client()
    client.table("applications").delete().eq("id", app_id).eq("user_id", user_id).execute()
    return True


def get_stats(user_id: str):
    applications = load_applications(user_id)
    total = len(applications)
    by_status = {}
    by_tier = {}
    for a in applications:
        s = a.get("status", "Not Applied")
        by_status[s] = by_status.get(s, 0) + 1
        t = f"Tier {a.get('tier', 1)}"
        by_tier[t] = by_tier.get(t, 0) + 1
    return {
        "total": total,
        "by_status": by_status,
        "by_tier": by_tier,
        "callbacks": by_status.get("Callback", 0),
        "interviews": by_status.get("Interview", 0),
        "offers": by_status.get("Offer", 0),
    }
