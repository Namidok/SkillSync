# ⚡ SkillSync — Job Application Tracker

I built this because I was applying to 50+ companies and had zero system to track any of it. Spreadsheets were a mess, I kept forgetting to follow up, and I had no idea which skills each company actually wanted. So I built SkillSync.

It's an AI-powered job application tracker that extracts skills from job descriptions using NLP, analyses your skill gaps, and keeps your entire pipeline organised — from first application to offer.

---

## What it does

- **Track applications** — add companies, roles, cities, tiers and status in one place
- **NLP skill extraction** — paste any job description and it pulls out every required tech skill automatically
- **Skill gap analysis** — compares the JD requirements against your current skillset and tells you exactly what you're missing
- **Pipeline dashboard** — live charts showing your callback rate, tier breakdown and application status at a glance
- **Follow-up reminders** — Gmail reminders at 9am and 7pm for any applications that need chasing
- **Find contacts** — one click to search LinkedIn for the right person at any company in your pipeline
- **Session isolation** — every user gets their own clean data via UUID-based sessions, no login needed

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React, Vite, Tailwind CSS, Recharts |
| Backend | Python, FastAPI, Pydantic |
| NLP | Custom skill extractor (60+ tech skills) |
| Reminders | Gmail SMTP, schedule |
| Storage | JSON (session-based, per user) |
| Deploy | Railway / Render (backend) + Vercel (frontend) |

---

## Running it locally

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/SkillSync.git
cd SkillSync
```

### 2. Set up the backend

```bash
pip install -r requirements.txt
```

Create a `.env` file in the root:

```
GMAIL_ADDRESS=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password
REMINDER_EMAIL=your_gmail@gmail.com
```

Start FastAPI:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`

### 4. Run email reminders (optional)

```bash
python reminder.py
```

Runs in the background, sends reminders at 9am and 7pm daily.

---

## Project structure

```
SkillSync/
├── app/
│   └── main.py          # FastAPI routes
├── utils/
│   ├── nlp.py           # Skill extractor + gap analysis
│   └── storage.py       # Session-based JSON storage
├── data/
│   └── sessions/        # Per-user data files (git ignored)
├── frontend/
│   ├── src/
│   │   ├── components/  # Sidebar, StatCard, StatusBadge, SkillTag
│   │   ├── pages/       # Dashboard, Applications, AddApplication, NLPExtractor, Landing
│   │   └── hooks/       # useApplications (data + session management)
│   └── ...
├── reminder.py          # Gmail reminder scheduler
├── requirements.txt
└── .env                 # Never pushed to GitHub
```
