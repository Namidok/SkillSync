from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from utils.nlp import extract_skills
from utils.storage import load_applications, save_applications

app = FastAPI(title="SkillSync API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Models ────────────────────────────────────────────────────────────────────

class ApplicationCreate(BaseModel):
    company: str
    role: str
    city: str
    tier: int
    job_description: Optional[str] = ""
    cover_letter_notes: Optional[str] = ""
    applied_date: Optional[str] = ""


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    cover_letter_notes: Optional[str] = None
    follow_up_date: Optional[str] = None
    notes: Optional[str] = None


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/applications", response_model=List[dict])
def get_applications(x_session_id: str = Header(default="default")):
    return load_applications(x_session_id)


@app.post("/applications", response_model=dict)
def create_application(
    app_data: ApplicationCreate,
    x_session_id: str = Header(default="default"),
):
    applications = load_applications(x_session_id)
    new_id = max((a["id"] for a in applications), default=0) + 1

    extracted = []
    if app_data.job_description:
        extracted = extract_skills(app_data.job_description)

    new_app = {
        "id": new_id,
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
        "created_at": datetime.now().isoformat(),
    }

    applications.append(new_app)
    save_applications(x_session_id, applications)
    return new_app


@app.patch("/applications/{app_id}", response_model=dict)
def update_application(
    app_id: int,
    update: ApplicationUpdate,
    x_session_id: str = Header(default="default"),
):
    applications = load_applications(x_session_id)
    for a in applications:
        if a["id"] == app_id:
            if update.status is not None:
                a["status"] = update.status
            if update.cover_letter_notes is not None:
                a["cover_letter_notes"] = update.cover_letter_notes
            if update.follow_up_date is not None:
                a["follow_up_date"] = update.follow_up_date
            if update.notes is not None:
                a["notes"] = update.notes
            save_applications(x_session_id, applications)
            return a
    raise HTTPException(status_code=404, detail="Application not found")


@app.delete("/applications/{app_id}")
def delete_application(
    app_id: int,
    x_session_id: str = Header(default="default"),
):
    applications = load_applications(x_session_id)
    applications = [a for a in applications if a["id"] != app_id]
    save_applications(x_session_id, applications)
    return {"message": "Deleted"}


@app.post("/extract-skills")
def extract_skills_endpoint(payload: dict):
    text = payload.get("text", "")
    return {"skills": extract_skills(text)}


@app.get("/stats")
def get_stats(x_session_id: str = Header(default="default")):
    applications = load_applications(x_session_id)
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