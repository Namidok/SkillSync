import { useState } from "react"
import SkillTag from "../components/SkillTag"
import useApplications from "../hooks/useApplications"

const TIER_LABELS = { 1: "🔥 Tier 1", 2: "⚡ Tier 2", 3: "🎯 Tier 3", 4: "🎲 Tier 4" }

const MASTER_COMPANIES = [
  ["Celonis",           "AI/ML Engineer",        "Munich",    1],
  ["HelloFresh",        "Data/ML Engineer",       "Berlin",    1],
  ["Delivery Hero",     "Data Engineer",          "Berlin",    1],
  ["SAP",               "AI Developer Intern",    "Munich",    1],
  ["N26",               "ML Engineer",            "Berlin",    1],
  ["Zalando",           "ML/Data Engineer",       "Berlin",    1],
  ["AUTO1 Group",       "Data Engineer",          "Berlin",    1],
  ["Siemens",           "AI/Data Engineer",       "Munich",    1],
  ["GetYourGuide",      "ML/Backend Eng",         "Berlin",    2],
  ["FlixBus",           "Data Engineer",          "Munich",    2],
  ["Personio",          "ML/Data Engineer",       "Munich",    2],
  ["Contentful",        "AI/Backend Eng",         "Berlin",    2],
  ["Trade Republic",    "Data Engineer",          "Berlin",    2],
  ["Miro",              "ML/Data Engineer",       "Berlin",    2],
  ["Enpal",             "Data/ML Engineer",       "Berlin",    2],
  ["BMW Group",         "Data/AI Engineer",       "Munich",    2],
  ["Bosch",             "AI/ML Engineer",         "Stuttgart", 2],
  ["DeepL",             "ML Engineer",            "Cologne",   2],
  ["Databricks",        "Data Engineer",          "Berlin",    2],
  ["Snowflake",         "Data Engineer",          "Munich",    2],
  ["Amazon Germany",    "Data Engineer Intern",   "Berlin",    2],
  ["Hawk AI",           "ML Engineer",            "Munich",    3],
  ["Scout24",           "Data/ML Engineer",       "Berlin",    3],
  ["Axel Springer",     "AI/Data Engineer",       "Berlin",    3],
  ["Tesla Germany",     "Data Engineer",          "Berlin",    3],
  ["Fraunhofer IIS",    "AI Research Intern",     "Erlangen",  3],
  ["Lufthansa Technik", "Data/AI Intern",         "Hamburg",   3],
  ["Volkswagen Group",  "Data/ML Engineer",       "Wolfsburg", 3],
  ["Porsche",           "Software/AI Intern",     "Stuttgart", 3],
  ["Airbus",            "AI/Data Engineer",       "Hamburg",   3],
  ["Google Germany",    "ML Engineer Intern",     "Munich",    4],
  ["Microsoft Germany", "AI Engineer Intern",     "Munich",    4],
  ["NVIDIA Germany",    "ML Engineer Intern",     "Munich",    4],
  ["Spotify Germany",   "ML Engineer Intern",     "Berlin",    4],
  ["Klarna Germany",    "ML/Data Intern",         "Berlin",    4],
  ["Salesforce DE",     "AI Engineer Intern",     "Munich",    4],
  ["Stripe Germany",    "Data Engineer Intern",   "Berlin",    4],
]

export default function AddApplication() {
  const { addApplication, bulkLoad, applications } = useApplications()

  const [form, setForm] = useState({
    company: "", role: "", city: "",
    tier: 1, job_description: "",
    cover_letter_notes: "",
    applied_date: new Date().toISOString().split("T")[0],
  })
  const [extractedSkills, setExtractedSkills] = useState([])
  const [submitting, setSubmitting]           = useState(false)
  const [bulkLoading, setBulkLoading]         = useState(false)
  const [success, setSuccess]                 = useState("")
  const [error, setError]                     = useState("")

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    if (!form.company || !form.role) {
      setError("Company and Role are required.")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      const result = await addApplication(form)
      setExtractedSkills(result.extracted_skills || [])
      setSuccess(`✅ Added ${form.company} — ${form.role}`)
      setForm({
        company: "", role: "", city: "",
        tier: 1, job_description: "",
        cover_letter_notes: "",
        applied_date: new Date().toISOString().split("T")[0],
      })
    } catch {
      setError("Failed to add application.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleBulkLoad = async () => {
    setBulkLoading(true)
    await bulkLoad(MASTER_COMPANIES)
    setBulkLoading(false)
    setSuccess(`✅ Target companies loaded.`)
  }

  return (
    <div className="space-y-8 max-w-3xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Add Application</h1>
        <p className="text-subtle text-sm mt-1">Track a new role manually or bulk load your target list.</p>
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-muted uppercase tracking-widest">Company *</label>
            <input
              type="text"
              value={form.company}
              onChange={e => set("company", e.target.value)}
              placeholder="e.g. Celonis"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted uppercase tracking-widest">Role *</label>
            <input
              type="text"
              value={form.role}
              onChange={e => set("role", e.target.value)}
              placeholder="e.g. ML Engineer"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted uppercase tracking-widest">City</label>
            <input
              type="text"
              value={form.city}
              onChange={e => set("city", e.target.value)}
              placeholder="e.g. Munich"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted uppercase tracking-widest">Tier</label>
            <select
              value={form.tier}
              onChange={e => set("tier", Number(e.target.value))}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
            >
              {[1,2,3,4].map(t => (
                <option key={t} value={t}>{TIER_LABELS[t]}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted uppercase tracking-widest">Applied Date</label>
            <input
              type="date"
              value={form.applied_date}
              onChange={e => set("applied_date", e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted uppercase tracking-widest">
            Job Description <span className="normal-case text-muted">(paste full JD for skill extraction)</span>
          </label>
          <textarea
            value={form.job_description}
            onChange={e => set("job_description", e.target.value)}
            placeholder="Paste the full job description here — skills will be extracted automatically..."
            rows={6}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted uppercase tracking-widest">Cover Letter Notes</label>
          <textarea
            value={form.cover_letter_notes}
            onChange={e => set("cover_letter_notes", e.target.value)}
            placeholder="Key angle, why you fit, specific points to mention..."
            rows={3}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {success && (
          <div className="space-y-2">
            <p className="text-green-400 text-sm">{success}</p>
            {extractedSkills.length > 0 && (
              <div>
                <p className="text-xs text-muted mb-1.5">Skills extracted:</p>
                <div className="flex flex-wrap gap-1.5">
                  {extractedSkills.map(s => <SkillTag key={s} skill={s} />)}
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
        >
          {submitting ? "Adding..." : "＋ Add Application"}
        </button>
      </div>

      {/* Bulk load */}
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-white font-medium mb-1">Bulk Load from Master Plan</p>
        <p className="text-subtle text-sm mb-4">
          Pre-load all {MASTER_COMPANIES.length} target companies in one click. Skips any already added.
        </p>
        <button
          onClick={handleBulkLoad}
          disabled={bulkLoading}
          className="bg-white/5 hover:bg-white/10 border border-border text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {bulkLoading ? "Loading..." : "📋 Load all target companies"}
        </button>
      </div>

    </div>
  )
}