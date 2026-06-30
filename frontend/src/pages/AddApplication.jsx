import { useState } from "react"
import SkillTag from "../components/SkillTag"
import useApplications from "../hooks/useApplications"

export default function AddApplication() {
  const { addApplication } = useApplications()

  const [form, setForm] = useState({
    company: "", role: "", city: "",
    job_description: "",
    cover_letter_notes: "",
    applied_date: new Date().toISOString().split("T")[0],
  })
  const [extractedSkills, setExtractedSkills] = useState([])
  const [submitting,      setSubmitting]      = useState(false)
  const [success,         setSuccess]         = useState("")
  const [error,           setError]           = useState("")

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
        job_description: "",
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

      <div>
        <h1 className="text-2xl font-bold text-white">Add Application</h1>
        <p className="text-subtle text-sm mt-1">Track a new job application.</p>
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
              placeholder="e.g. London, Remote"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent transition-colors"
            />
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
