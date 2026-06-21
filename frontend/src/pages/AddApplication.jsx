import { useState } from "react"
import { ExternalLink, X, Search } from "lucide-react"
import SkillTag from "../components/SkillTag"
import useApplications from "../hooks/useApplications"

const TIER_LABELS = { 1: "🔥 Tier 1", 2: "⚡ Tier 2", 3: "🎯 Tier 3", 4: "🎲 Tier 4" }

function ReferralModal({ onClose }) {
  const [url,     setUrl]     = useState("")
  const [company, setCompany] = useState("")
  const [role,    setRole]    = useState("")

  const extractFromUrl = (inputUrl) => {
    try {
      const domain = new URL(inputUrl).hostname.replace("www.", "").split(".")[0]
      setCompany(domain.charAt(0).toUpperCase() + domain.slice(1))
    } catch {
      setCompany("")
    }
  }

  const handleUrlChange = (e) => {
    setUrl(e.target.value)
    extractFromUrl(e.target.value)
  }

  const searches = [
    {
      label: "LinkedIn People Search",
      desc:  "Find team members & hiring managers",
      icon:  "🔗",
      color: "border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/5",
      action: () => {
        const q = encodeURIComponent(`"${company}" "${role || "engineer"}" site:linkedin.com`)
        window.open(`https://www.google.com/search?q=${q}`, "_blank")
      },
    },
    {
      label: "Hunter.io Email Finder",
      desc:  "Find work emails at this company",
      icon:  "📧",
      color: "border-orange-500/30 hover:border-orange-500/60 hover:bg-orange-500/5",
      action: () => {
        let domain = company.toLowerCase() + ".com"
        try { domain = new URL(url).hostname.replace("www.", "") } catch {}
        window.open(`https://hunter.io/search/${domain}`, "_blank")
      },
    },
    {
      label: "Company LinkedIn Page",
      desc:  "Browse the full team directory",
      icon:  "🏢",
      color: "border-green-500/30 hover:border-green-500/60 hover:bg-green-500/5",
      action: () => {
        const q = encodeURIComponent(`${company} LinkedIn company page`)
        window.open(`https://www.google.com/search?q=${q}`, "_blank")
      },
    },
  ]

  const handleFindAll = () => {
    if (!company) return
    searches.forEach(s => s.action())
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111318] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">Find Referral</h2>
            <p className="text-white/40 text-xs mt-0.5">Paste the job posting URL to find contacts</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-white/30 uppercase tracking-widest">Job Posting URL</label>
            <input
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://company.com/careers/job-123"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-white/30 uppercase tracking-widest">Company</label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Celonis"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/30 uppercase tracking-widest">Role</label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. ML Engineer"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2 pt-1">
            <p className="text-xs text-white/30 uppercase tracking-widest">Open searches</p>
            {searches.map(({ label, desc, icon, color, action }) => (
              <button
                key={label}
                onClick={action}
                disabled={!company}
                className={`w-full flex items-center justify-between bg-white/[0.02] border rounded-xl px-4 py-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${color}`}
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="text-lg">{icon}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{label}</p>
                    <p className="text-white/30 text-xs">{desc}</p>
                  </div>
                </div>
                <ExternalLink size={14} className="text-white/20" />
              </button>
            ))}
          </div>
          <button
            onClick={handleFindAll}
            disabled={!company}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            <Search size={14} className="inline mr-2" />
            Open All 3 Searches
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AddApplication() {
  const { addApplication } = useApplications()

  const [form, setForm] = useState({
    company: "", role: "", city: "",
    tier: 1, job_description: "",
    cover_letter_notes: "",
    applied_date: new Date().toISOString().split("T")[0],
  })
  const [extractedSkills, setExtractedSkills] = useState([])
  const [submitting,      setSubmitting]      = useState(false)
  const [success,         setSuccess]         = useState("")
  const [error,           setError]           = useState("")
  const [showReferral,    setShowReferral]    = useState(false)

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

  return (
    <div className="space-y-8 max-w-3xl">

      {showReferral && <ReferralModal onClose={() => setShowReferral(false)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Add Application</h1>
          <p className="text-subtle text-sm mt-1">Track a new job application.</p>
        </div>
        <button
          onClick={() => setShowReferral(true)}
          className="flex items-center gap-2 border border-border text-subtle hover:text-white hover:border-accent/40 px-4 py-2 rounded-lg text-sm transition-all"
        >
          <Search size={14} />
          Find Referral
        </button>
      </div>

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
              {[1,2,3,4].map(t => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
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

        {error && <p className="text-red-400 text-sm">{error}</p>}

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
    </div>
  )
}
