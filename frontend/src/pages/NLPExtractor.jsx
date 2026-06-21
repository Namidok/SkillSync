import { useState } from "react"
import SkillTag from "../components/SkillTag"
import useApplications from "../hooks/useApplications"
import { Scan } from "lucide-react"

export default function NLPExtractor() {
  const { extractSkills, applications } = useApplications()

  const [jd,       setJd]       = useState("")
  const [skills,   setSkills]   = useState([])
  const [matched,  setMatched]  = useState([])
  const [missing,  setMissing]  = useState([])
  const [coverage, setCoverage] = useState(null)
  const [loading,  setLoading]  = useState(false)

  // Build your skill set dynamically from all tracked applications
  const yourSkills = new Set(
    applications.flatMap(a => a.extracted_skills || [])
  )

  const handleExtract = async () => {
    if (!jd.trim()) return
    setLoading(true)
    const found = await extractSkills(jd)
    setSkills(found)

    const matchedArr = found.filter(s => yourSkills.has(s))
    const missingArr = found.filter(s => !yourSkills.has(s))
    const pct = found.length
      ? Math.round((matchedArr.length / found.length) * 100)
      : 0

    setMatched(matchedArr)
    setMissing(missingArr)
    setCoverage(pct)
    setLoading(false)
  }

  return (
    <div className="space-y-8 max-w-3xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Skill Scanner</h1>
        <p className="text-subtle text-sm mt-1">
          Paste any job description — instantly see which skills are required and how well you match.
        </p>
      </div>

      {/* Empty state — no results yet */}
      {skills.length === 0 && !jd.trim() && (
        <div className="bg-card border border-border rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto">
            <Scan size={24} className="text-accent" />
          </div>
          <h3 className="text-white font-semibold">Scan a job description</h3>
          <p className="text-subtle text-sm max-w-sm mx-auto leading-relaxed">
            Paste the requirements section of any job posting below. We'll extract every tech skill and show you exactly where your gaps are.
          </p>
        </div>
      )}

      {/* Input */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <label className="text-xs text-muted uppercase tracking-widest">Job Description</label>
        <textarea
          value={jd}
          onChange={e => setJd(e.target.value)}
          placeholder="Paste the full job description here — focus on the requirements and qualifications section..."
          rows={8}
          className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none"
        />
        <button
          onClick={handleExtract}
          disabled={loading || !jd.trim()}
          className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
        >
          <Scan size={16} />
          {loading ? "Scanning..." : "Scan Job Description"}
        </button>
      </div>

      {/* Results */}
      {skills.length > 0 && (
        <div className="space-y-6">

          {/* Coverage bar */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted uppercase tracking-widest">Skill Coverage</p>
              <p className={`text-2xl font-black ${
                coverage >= 70 ? "text-green-400" :
                coverage >= 40 ? "text-yellow-400" : "text-red-400"
              }`}>{coverage}%</p>
            </div>
            <div className="h-2.5 bg-surface rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  coverage >= 70 ? "bg-green-400" :
                  coverage >= 40 ? "bg-yellow-400" : "bg-red-400"
                }`}
                style={{ width: `${coverage}%` }}
              />
            </div>
            <div className="flex gap-4 text-xs text-muted">
              <span className="text-green-400 font-semibold">{matched.length} matched</span>
              <span className="text-red-400 font-semibold">{missing.length} missing</span>
              <span>{skills.length} total required</span>
            </div>
          </div>

          {/* Matched skills */}
          {matched.length > 0 && (
            <div className="bg-card border border-green-900/30 rounded-xl p-5 space-y-3">
              <p className="text-xs text-muted uppercase tracking-widest">✓ Your Matched Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {matched.map(s => <SkillTag key={s} skill={s} variant="matched" />)}
              </div>
            </div>
          )}

          {/* Missing skills */}
          {missing.length > 0 && (
            <div className="bg-card border border-red-900/30 rounded-xl p-5 space-y-3">
              <p className="text-xs text-muted uppercase tracking-widest">✗ Skills to Develop</p>
              <div className="flex flex-wrap gap-1.5">
                {missing.map(s => <SkillTag key={s} skill={s} variant="missing" />)}
              </div>
            </div>
          )}

        </div>
      )}

      {skills.length === 0 && jd.trim() && !loading && (
        <div className="bg-card border border-border rounded-xl p-5 text-center">
          <p className="text-muted text-sm">
            No recognisable tech skills found. Try pasting the qualifications or requirements section of the JD.
          </p>
        </div>
      )}

    </div>
  )
}
