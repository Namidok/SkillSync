"""
SkillSync — Job Application Tracker
Run: streamlit run streamlit_app.py
"""
import streamlit as st
import plotly.graph_objects as go
import requests
from datetime import datetime, date, timedelta

API_BASE = "http://localhost:8000"

# ── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="SkillSync",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Custom CSS ─────────────────────────────────────────────────────────────────
st.markdown("""
<style>
    .stApp { background-color: #0f1117; }

    div[data-testid="metric-container"] {
        background: #1a1d27;
        border: 1px solid #2d3748;
        border-radius: 12px;
        padding: 16px 20px;
    }
    div[data-testid="metric-container"] label {
        color: #a0aec0 !important;
        font-size: 0.75rem !important;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }
    div[data-testid="metric-container"] div[data-testid="metric-value"] {
        color: #f7fafc !important;
        font-size: 2rem !important;
        font-weight: 700;
    }
    .skill-tag {
        display: inline-block;
        background: #2d3748;
        color: #90cdf4;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.7rem;
        margin: 2px;
        font-family: 'Courier New', monospace;
    }
    .section-header {
        font-size: 0.65rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #4a5568;
        margin-bottom: 12px;
        padding-bottom: 6px;
        border-bottom: 1px solid #2d3748;
    }
    .followup-alert {
        background: #2d2000;
        border-left: 3px solid #f6ad55;
        padding: 8px 12px;
        border-radius: 0 6px 6px 0;
        font-size: 0.82rem;
        color: #fbd38d;
        margin-bottom: 6px;
    }
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
</style>
""", unsafe_allow_html=True)


# ── Constants ─────────────────────────────────────────────────────────────────
STATUS_OPTIONS = ["Not Applied", "Applied", "Callback", "Interview", "Offer", "Rejected"]
TIER_LABELS = {1: "🔥 Tier 1", 2: "⚡ Tier 2", 3: "🎯 Tier 3", 4: "🎲 Tier 4"}
STATUS_COLORS = {
    "Not Applied": "#718096",
    "Applied":     "#63b3ed",
    "Callback":    "#68d391",
    "Interview":   "#f6ad55",
    "Offer":       "#48bb78",
    "Rejected":    "#fc8181",
}
MASTER_COMPANIES = [
    ("Celonis",           "AI/ML Engineer",        "Munich",    1),
    ("HelloFresh",        "Data/ML Engineer",       "Berlin",    1),
    ("Delivery Hero",     "Data Engineer",          "Berlin",    1),
    ("SAP",               "AI Developer Intern",    "Munich",    1),
    ("N26",               "ML Engineer",            "Berlin",    1),
    ("Zalando",           "ML/Data Engineer",       "Berlin",    1),
    ("AUTO1 Group",       "Data Engineer",          "Berlin",    1),
    ("Siemens",           "AI/Data Engineer",       "Munich",    1),
    ("GetYourGuide",      "ML/Backend Eng",         "Berlin",    2),
    ("FlixBus",           "Data Engineer",          "Munich",    2),
    ("Personio",          "ML/Data Engineer",       "Munich",    2),
    ("Contentful",        "AI/Backend Eng",         "Berlin",    2),
    ("Trade Republic",    "Data Engineer",          "Berlin",    2),
    ("Miro",              "ML/Data Engineer",       "Berlin",    2),
    ("Enpal",             "Data/ML Engineer",       "Berlin",    2),
    ("BMW Group",         "Data/AI Engineer",       "Munich",    2),
    ("Bosch",             "AI/ML Engineer",         "Stuttgart", 2),
    ("DeepL",             "ML Engineer",            "Cologne",   2),
    ("Databricks",        "Data Engineer",          "Berlin",    2),
    ("Snowflake",         "Data Engineer",          "Munich",    2),
    ("Amazon Germany",    "Data Engineer Intern",   "Berlin",    2),
    ("Hawk AI",           "ML Engineer",            "Munich",    3),
    ("Scout24",           "Data/ML Engineer",       "Berlin",    3),
    ("Axel Springer",     "AI/Data Engineer",       "Berlin",    3),
    ("Tesla Germany",     "Data Engineer",          "Berlin",    3),
    ("Fraunhofer IIS",    "AI Research Intern",     "Erlangen",  3),
    ("Lufthansa Technik", "Data/AI Intern",         "Hamburg",   3),
    ("Volkswagen Group",  "Data/ML Engineer",       "Wolfsburg", 3),
    ("Porsche",           "Software/AI Intern",     "Stuttgart", 3),
    ("Airbus",            "AI/Data Engineer",       "Hamburg",   3),
    ("Google Germany",    "ML Engineer Intern",     "Munich",    4),
    ("Microsoft Germany", "AI Engineer Intern",     "Munich",    4),
    ("NVIDIA Germany",    "ML Engineer Intern",     "Munich",    4),
    ("Spotify Germany",   "ML Engineer Intern",     "Berlin",    4),
    ("Klarna Germany",    "ML/Data Intern",         "Berlin",    4),
    ("Salesforce DE",     "AI Engineer Intern",     "Munich",    4),
    ("Stripe Germany",    "Data Engineer Intern",   "Berlin",    4),
]


# ── API helpers ───────────────────────────────────────────────────────────────
def api_get(endpoint):
    try:
        r = requests.get(f"{API_BASE}{endpoint}", timeout=5)
        return r.json()
    except Exception:
        return None

def api_post(endpoint, data):
    try:
        r = requests.post(f"{API_BASE}{endpoint}", json=data, timeout=5)
        return r.json()
    except Exception as e:
        return {"error": str(e)}

def api_patch(endpoint, data):
    try:
        r = requests.patch(f"{API_BASE}{endpoint}", json=data, timeout=5)
        return r.json()
    except Exception as e:
        return {"error": str(e)}

def api_delete(endpoint):
    try:
        r = requests.delete(f"{API_BASE}{endpoint}", timeout=5)
        return r.json()
    except Exception as e:
        return {"error": str(e)}

def skills_html(skills: list) -> str:
    if not skills:
        return '<span style="color:#4a5568;font-size:0.75rem">No skills extracted</span>'
    return "".join(f'<span class="skill-tag">{s}</span>' for s in skills)


# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 🎯 SkillSync")
    st.markdown('<p class="section-header">Navigation</p>', unsafe_allow_html=True)
    page = st.radio(
        "", ["Dashboard", "All Applications", "Add Application", "NLP Extractor"],
        label_visibility="collapsed",
    )
    st.divider()
    st.markdown('<p class="section-header">Filters</p>', unsafe_allow_html=True)
    filter_tier   = st.multiselect("Tier",   [1, 2, 3, 4], default=[1, 2, 3, 4])
    filter_status = st.multiselect("Status", STATUS_OPTIONS,
                                   default=["Not Applied", "Applied", "Callback", "Interview", "Offer"])


# ── Load data ─────────────────────────────────────────────────────────────────
apps   = api_get("/applications") or []
stats  = api_get("/stats") or {}
filtered = [
    a for a in apps
    if a.get("tier") in filter_tier and a.get("status") in filter_status
]


# ══════════════════════════════════════════════════════════════════════════════
# PAGE: Dashboard
# ══════════════════════════════════════════════════════════════════════════════
if page == "Dashboard":
    st.markdown("# SkillSync Dashboard")
    st.markdown(f"*{datetime.now().strftime('%d %b %Y, %H:%M')}*")
    st.divider()

    # KPIs
    c1, c2, c3, c4, c5 = st.columns(5)
    total = stats.get("total", 0)
    callbacks = stats.get("callbacks", 0)
    c1.metric("Total",      total)
    c2.metric("Callbacks",  callbacks)
    c3.metric("Interviews", stats.get("interviews", 0))
    c4.metric("Offers",     stats.get("offers", 0))
    c5.metric("Callback Rate", f"{round(callbacks / total * 100, 1) if total else 0}%")

    st.divider()

    col_l, col_r = st.columns(2)

    with col_l:
        st.markdown('<p class="section-header">Applications by status</p>', unsafe_allow_html=True)
        if apps:
            sc = {}
            for a in apps:
                s = a.get("status", "Not Applied")
                sc[s] = sc.get(s, 0) + 1
            fig = go.Figure(go.Bar(
                x=list(sc.keys()), y=list(sc.values()),
                marker_color=[STATUS_COLORS.get(k, "#718096") for k in sc],
                text=list(sc.values()), textposition="outside",
            ))
            fig.update_layout(
                paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
                font_color="#a0aec0", height=260,
                margin=dict(t=20, b=20, l=0, r=0),
                xaxis=dict(showgrid=False),
                yaxis=dict(showgrid=True, gridcolor="#2d3748"),
            )
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("Add applications to see charts.")

    with col_r:
        st.markdown('<p class="section-header">Pipeline by tier</p>', unsafe_allow_html=True)
        if apps:
            tc = {}
            for a in apps:
                t = f"Tier {a.get('tier', 1)}"
                tc[t] = tc.get(t, 0) + 1
            fig2 = go.Figure(go.Pie(
                labels=list(tc.keys()), values=list(tc.values()),
                hole=0.55,
                marker_colors=["#63b3ed", "#68d391", "#f6ad55", "#fc8181"],
            ))
            fig2.update_layout(
                paper_bgcolor="rgba(0,0,0,0)", font_color="#a0aec0",
                height=260, margin=dict(t=20, b=20, l=0, r=0),
                legend=dict(font=dict(color="#a0aec0")),
            )
            st.plotly_chart(fig2, use_container_width=True)
        else:
            st.info("Add applications to see charts.")

    # Follow-up alerts
    st.divider()
    st.markdown('<p class="section-header">Follow-up alerts</p>', unsafe_allow_html=True)
    today = date.today()
    due = [
        a for a in apps
        if a.get("follow_up_date")
        and datetime.strptime(a["follow_up_date"], "%Y-%m-%d").date() <= today
        and a.get("status") not in ("Offer", "Rejected")
    ]
    if due:
        for a in due:
            st.markdown(
                f'<div class="followup-alert">⚠️ <strong>{a["company"]}</strong> — '
                f'{a["role"]} · Follow up due {a["follow_up_date"]}</div>',
                unsafe_allow_html=True,
            )
    else:
        st.markdown('<span style="color:#4a5568">No follow-ups due today.</span>', unsafe_allow_html=True)


# ══════════════════════════════════════════════════════════════════════════════
# PAGE: All Applications
# ══════════════════════════════════════════════════════════════════════════════
elif page == "All Applications":
    st.markdown("# All Applications")
    st.markdown(f"Showing **{len(filtered)}** of **{len(apps)}** total")
    st.divider()

    if not filtered:
        st.info("No applications match your filters.")
    else:
        for a in sorted(filtered, key=lambda x: (x.get("tier", 4), x.get("company", ""))):
            with st.expander(
                f"{TIER_LABELS.get(a['tier'], '')}  ·  **{a['company']}** — {a['role']}  ·  {a['city']}",
            ):
                col1, col2 = st.columns([2, 1])
                with col1:
                    st.markdown(f"**Status:** `{a.get('status','Not Applied')}`")
                    st.markdown(f"**Applied:** {a.get('applied_date','—')}")
                    st.markdown(f"**Follow-up:** {a.get('follow_up_date','—') or '—'}")
                    if a.get("notes"):
                        st.markdown(f"**Notes:** {a['notes']}")
                    st.markdown("**Extracted skills:**")
                    st.markdown(skills_html(a.get("extracted_skills", [])), unsafe_allow_html=True)

                with col2:
                    new_status = st.selectbox(
                        "Status", STATUS_OPTIONS,
                        index=STATUS_OPTIONS.index(a.get("status", "Not Applied")),
                        key=f"status_{a['id']}",
                    )
                    new_followup = st.date_input(
                        "Follow-up date",
                        value=datetime.strptime(a["follow_up_date"], "%Y-%m-%d").date()
                              if a.get("follow_up_date") else date.today() + timedelta(days=7),
                        key=f"fu_{a['id']}",
                    )
                    new_notes = st.text_input("Notes", value=a.get("notes", ""), key=f"notes_{a['id']}")

                    col_save, col_del = st.columns(2)
                    with col_save:
                        if st.button("💾 Save", key=f"save_{a['id']}"):
                            api_patch(f"/applications/{a['id']}", {
                                "status": new_status,
                                "follow_up_date": str(new_followup),
                                "notes": new_notes,
                            })
                            st.success("Saved!")
                            st.rerun()
                    with col_del:
                        if st.button("🗑 Delete", key=f"del_{a['id']}"):
                            api_delete(f"/applications/{a['id']}")
                            st.rerun()


# ══════════════════════════════════════════════════════════════════════════════
# PAGE: Add Application
# ══════════════════════════════════════════════════════════════════════════════
elif page == "Add Application":
    st.markdown("# Add New Application")
    st.divider()

    with st.form("add_form", clear_on_submit=True):
        c1, c2 = st.columns(2)
        with c1:
            company      = st.text_input("Company *",  placeholder="e.g. Celonis")
            role         = st.text_input("Role *",     placeholder="e.g. AI/ML Engineer")
            city         = st.text_input("City",       placeholder="e.g. Munich")
        with c2:
            tier         = st.selectbox("Tier", [1, 2, 3, 4], format_func=lambda x: TIER_LABELS[x])
            applied_date = st.date_input("Applied date",      value=date.today())
            follow_up    = st.date_input("Follow-up reminder", value=date.today() + timedelta(days=7))

        jd_text      = st.text_area("Paste Job Description", height=200,
                                    placeholder="Paste JD here — skills extracted automatically...")
        cover_notes  = st.text_area("Cover letter notes", height=80)
        submitted    = st.form_submit_button("➕ Add Application", use_container_width=True)

    if submitted:
        if not company or not role:
            st.error("Company and Role are required.")
        else:
            result = api_post("/applications", {
                "company": company, "role": role, "city": city,
                "tier": tier, "job_description": jd_text,
                "cover_letter_notes": cover_notes,
                "applied_date": str(applied_date),
            })
            if "error" in result:
                st.error(f"Error: {result['error']}")
            else:
                st.success(f"✅ Added **{company}** — {role}")
                skills = result.get("extracted_skills", [])
                if skills:
                    st.markdown(f"**Skills extracted:** {skills_html(skills)}", unsafe_allow_html=True)

    st.divider()
    st.markdown("### Bulk load from Master Plan")
    if st.button("📋 Load all target companies"):
        existing = {a["company"] for a in apps}
        added = 0
        for co, ro, ci, ti in MASTER_COMPANIES:
            if co not in existing:
                api_post("/applications", {
                    "company": co, "role": ro, "city": ci,
                    "tier": ti, "job_description": "", "applied_date": "",
                })
                added += 1
        st.success(f"✅ Added {added} companies.")
        st.rerun()


# ══════════════════════════════════════════════════════════════════════════════
# PAGE: NLP Extractor
# ══════════════════════════════════════════════════════════════════════════════
elif page == "NLP Extractor":
    st.markdown("# NLP Skill Extractor")
    st.markdown("Paste any job description — extract required skills and see your gap instantly.")
    st.divider()

    jd_input = st.text_area("Paste job description", height=300,
                             placeholder="Paste the full JD here...")

    if st.button("🔍 Extract Skills", use_container_width=True):
        if not jd_input.strip():
            st.warning("Please paste a job description first.")
        else:
            result = api_post("/extract-skills", {"text": jd_input})
            skills = result.get("skills", [])
            if skills:
                st.markdown("### Extracted skills")
                st.markdown(skills_html(skills), unsafe_allow_html=True)
                st.markdown(f"**{len(skills)} skills found**")

                from utils.nlp import YOUR_SKILLS, skill_gap_analysis
                gap = skill_gap_analysis(YOUR_SKILLS, skills)

                st.divider()
                col1, col2, col3 = st.columns(3)
                col1.metric("Coverage",  f"{gap['coverage_pct']}%")
                col2.metric("Matched",   len(gap["matched"]))
                col3.metric("Missing",   len(gap["missing"]))

                if gap["missing"]:
                    st.markdown("**Skills to develop:**")
                    st.markdown(skills_html(gap["missing"]), unsafe_allow_html=True)
                if gap["matched"]:
                    st.markdown("**Your matched skills:**")
                    st.markdown(skills_html(gap["matched"]), unsafe_allow_html=True)
            else:
                st.info("No skills found. Try a more detailed JD.")