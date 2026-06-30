from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from utils.nlp import extract_skills
from utils.storage import (
    load_applications, save_application,
    update_application, delete_application, get_stats
)
import os
from supabase import create_client
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

app = FastAPI(title="SkillSync API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_user_id(authorization: str = None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.replace("Bearer ", "")
    try:
        client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        user = client.auth.get_user(token)
        return user.user.id
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


class ApplicationCreate(BaseModel):
    company: str
    role: str
    city: str
    tier: int = 1
    job_description: Optional[str] = ""
    cover_letter_notes: Optional[str] = ""
    applied_date: Optional[str] = ""


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    cover_letter_notes: Optional[str] = None
    follow_up_date: Optional[str] = None
    notes: Optional[str] = None


@app.get("/applications")
def get_applications(authorization: str = Header(default=None)):
    user_id = get_user_id(authorization)
    return load_applications(user_id)


@app.post("/applications")
def create_application(app_data: ApplicationCreate, authorization: str = Header(default=None)):
    user_id = get_user_id(authorization)
    extracted = []
    if app_data.job_description:
        extracted = extract_skills(app_data.job_description)
    new_app = {
        "company": app_data.company,
        "role": app_data.role,
        "city": app_data.city,
        "tier": app_data.tier,
        "status": "Not Applied",
        "job_description": app_data.job_description,
        "extracted_skills": extracted,
        "cover_letter_notes": app_data.cover_letter_notes,
        "applied_date": app_data.applied_date or datetime.today().strftime("%Y-%m-%d"),
        "follow_up_date": "",
        "notes": "",
    }
    result = save_application(user_id, new_app)
    return result


@app.patch("/applications/{app_id}")
def update_application_endpoint(
    app_id: int,
    update: ApplicationUpdate,
    authorization: str = Header(default=None)
):
    user_id = get_user_id(authorization)
    updates = {k: v for k, v in update.dict().items() if v is not None}
    result = update_application(user_id, app_id, updates)
    if not result:
        raise HTTPException(status_code=404, detail="Application not found")
    return result


@app.delete("/applications/{app_id}")
def delete_application_endpoint(app_id: int, authorization: str = Header(default=None)):
    user_id = get_user_id(authorization)
    delete_application(user_id, app_id)
    return {"message": "Deleted"}


@app.post("/extract-skills")
def extract_skills_endpoint(payload: dict):
    text = payload.get("text", "")
    return {"skills": extract_skills(text)}


@app.get("/stats")
def get_stats_endpoint(authorization: str = Header(default=None)):
    user_id = get_user_id(authorization)
    return get_stats(user_id)
