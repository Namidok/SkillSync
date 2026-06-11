import { useState } from "react"
import SkillTag from "../components/SkillTag"
import useApplications from "../hooks/useApplications"

const YOUR_SKILLS = [
  "python", "sql", "pandas", "numpy", "pytorch", "keras", "tensorflow",
  "fastapi", "langchain", "chromadb", "docker", "aws", "s3",
  "ec2", "github actions", "streamlit", "rag", "embeddings",
]

export default function NLPExtractor() {
  const { extractSkills } = useApplications()

  const [jd,       setJd]       = useState("")
  const [skills,   setSkills]   = useState([])
  const [matched,  setMatched]  = useState([])
  const [missing,  setMissing]  = useState([])
  const [coverage, setCoverage] = useState(null)
  const [loading,  setLoading]  = useState(false)

  const handleExtract = async () => {
    if (!jd.trim()) return
    setLoading(true)
    const found = await extractSkills(jd)
    setSkills(found)

    const yourSet    = new Set(YOUR_SKILLS)
    const foundSet   = new Set(found)
    const matchedArr = found.filter(s => yourSet.has(s))
    const missingArr = found.filter(s => !yourSet.has(s))
    const pct        = found.length
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
        <h1 className="text-2xl font-bold text-white">NLP Extractor</h1>
        <p className="text-subtle text-sm mt-1">
          Paste any job description — extract required skills and see your gap instantly.
        </p>
      </div>

      {/* Input */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <label className="text-xs text-muted uppercase tracking-widest">
          Job Description
        </label>
        <textarea
          value={jd}
          onChange={e => setJd(e.target.value)}
          placeholder="Paste the full job description here..."
          rows={8}
          className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none"
        />
        <button
          onClick={handleExtract}
          disabled={loading || !jd.trim()}
          className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
        >
          {loading ? "Extracting..." : "🔍 Extract Skills"}
        </button>
      </div>

      {/* Results */}
      {skills.length > 0 && (
        <div className="space-y-6">

          {/* Coverage metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-xs text-muted uppercase tracking-widest mb-1">Coverage</p>
              <p className={`text-3xl font-bold ${
                coverage >= 70 ? "text-green-400" :
                coverage >= 40 ? "text-yellow-400" : "text-red-400"
              }`}>{coverage}%</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-xs text-muted uppercase tracking-widest mb-1">Matched</p>
              <p className="text-3xl font-bold text-green-400">{matched.length}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-xs text-muted uppercase tracking-widest mb-1">Missing</p>
              <p className="text-3xl font-bold text-red-400">{missing.length}</p>
            </div>
          </div>

          {/* All extracted */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <p className="text-xs text-muted uppercase tracking-widest">
              All Extracted — {skills.length} skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {skills.map(s => (
                <SkillTag
                  key={s}
                  skill={s}
                  variant={matched.includes(s) ? "matched" : "missing"}
                />
              ))}
            </div>
          </div>

          {/* Missing skills */}
          {missing.length > 0 && (
            <div className="bg-card border border-red-900/30 rounded-xl p-5 space-y-3">
              <p className="text-xs text-muted uppercase tracking-widest">
                Skills to Develop
              </p>
              <div className="flex flex-wrap gap-1.5">
                {missing.map(s => <SkillTag key={s} skill={s} variant="missing" />)}
              </div>
            </div>
          )}

          {/* Matched skills */}
          {matched.length > 0 && (
            <div className="bg-card border border-green-900/30 rounded-xl p-5 space-y-3">
              <p className="text-xs text-muted uppercase tracking-widest">
                Your Matched Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {matched.map(s => <SkillTag key={s} skill={s} variant="matched" />)}
              </div>
            </div>
          )}

        </div>
      )}

      {skills.length === 0 && jd.trim() && !loading && (
        <div className="bg-card border border-border rounded-xl p-5 text-center">
          <p className="text-muted text-sm">
            No recognisable tech skills found. Try pasting the qualifications section of the JD.
          </p>
        </div>
      )}

    </div>
  )
}