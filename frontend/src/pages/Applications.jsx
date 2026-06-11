import { useState } from "react"
import { Search, ExternalLink } from "lucide-react"
import StatusBadge from "../components/StatusBadge"
import SkillTag from "../components/SkillTag"
import useApplications from "../hooks/useApplications"

const STATUS_OPTIONS = ["Not Applied", "Applied", "Callback", "Interview", "Offer", "Rejected"]
const TIER_LABELS    = { 1: "🔥 Tier 1", 2: "⚡ Tier 2", 3: "🎯 Tier 3", 4: "🎲 Tier 4" }

export default function Applications() {
  const { applications, loading, updateApplication, deleteApplication } = useApplications()

  const [search,     setSearch]     = useState("")
  const [tierFilter, setTierFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [expanded,   setExpanded]   = useState(null)
  const [editing,    setEditing]    = useState({})

  const filtered = applications.filter(a => {
    const matchSearch = (
      a.company.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase())
    )
    const matchTier   = tierFilter   === "All" || a.tier === Number(tierFilter)
    const matchStatus = statusFilter === "All" || a.status === statusFilter
    return matchSearch && matchTier && matchStatus
  })

  const handleSave = async (id) => {
    await updateApplication(id, editing[id] || {})
    setExpanded(null)
  }

  const handleDelete = async (id) => {
    if (confirm("Remove this application?")) {
      await deleteApplication(id)
      setExpanded(null)
    }
  }

  const linkedInSearch = (company, role) => {
    const q = encodeURIComponent(`${company} ${role} site:linkedin.com`)
    window.open(`https://www.google.com/search?q=${q}`, "_blank")
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Applications</h1>
          <p className="text-subtle text-sm mt-1">
            Showing <span className="text-white font-medium">{filtered.length}</span> of {applications.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search company, role, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Tier filter */}
        <select
          value={tierFilter}
          onChange={e => setTierFilter(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-subtle focus:outline-none focus:border-accent"
        >
          <option value="All">All Tiers</option>
          {[1,2,3,4].map(t => (
            <option key={t} value={t}>{TIER_LABELS[t]}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-subtle focus:outline-none focus:border-accent"
        >
          <option value="All">All Statuses</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs text-muted uppercase tracking-widest px-5 py-3">Company</th>
              <th className="text-left text-xs text-muted uppercase tracking-widest px-5 py-3">Role</th>
              <th className="text-left text-xs text-muted uppercase tracking-widest px-5 py-3 hidden md:table-cell">City</th>
              <th className="text-left text-xs text-muted uppercase tracking-widest px-5 py-3 hidden lg:table-cell">Tier</th>
              <th className="text-left text-xs text-muted uppercase tracking-widest px-5 py-3">Status</th>
              <th className="text-left text-xs text-muted uppercase tracking-widest px-5 py-3 hidden lg:table-cell">Applied</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted py-12 text-sm">
                  No applications match your filters.
                </td>
              </tr>
            )}
            {filtered
              .sort((a, b) => a.tier - b.tier || a.company.localeCompare(b.company))
              .map(a => (
              <>
                {/* Main row */}
                <tr
                  key={a.id}
                  onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                  className="border-b border-border/50 hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium text-white">{a.company}</td>
                  <td className="px-5 py-3.5 text-subtle">{a.role}</td>
                  <td className="px-5 py-3.5 text-subtle hidden md:table-cell">{a.city}</td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-xs text-muted">{TIER_LABELS[a.tier]}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-5 py-3.5 text-muted text-xs hidden lg:table-cell">
                    {a.applied_date || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-muted text-xs">
                      {expanded === a.id ? "▲" : "▼"}
                    </span>
                  </td>
                </tr>

                {/* Expanded row */}
                {expanded === a.id && (
                  <tr key={`${a.id}-expanded`} className="bg-surface">
                    <td colSpan={7} className="px-5 py-5">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Left — details */}
                        <div className="space-y-4">

                          {/* Skills */}
                          {a.extracted_skills?.length > 0 && (
                            <div>
                              <p className="text-xs text-muted uppercase tracking-widest mb-2">
                                Extracted Skills
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {a.extracted_skills.map(s => (
                                  <SkillTag key={s} skill={s} />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Cover notes */}
                          {a.cover_letter_notes && (
                            <div>
                              <p className="text-xs text-muted uppercase tracking-widest mb-1">
                                Cover Letter Notes
                              </p>
                              <p className="text-subtle text-sm">{a.cover_letter_notes}</p>
                            </div>
                          )}

                          {/* Find contact */}
                          <button
                            onClick={() => linkedInSearch(a.company, a.role)}
                            className="flex items-center gap-2 text-xs text-accent hover:text-accent-hover transition-colors"
                          >
                            <ExternalLink size={12} />
                            Find contact on LinkedIn
                          </button>
                        </div>

                        {/* Right — edit */}
                        <div className="space-y-3">
                          <p className="text-xs text-muted uppercase tracking-widest">
                            Update
                          </p>

                          <select
                            defaultValue={a.status}
                            onChange={e => setEditing(prev => ({
                              ...prev,
                              [a.id]: { ...prev[a.id], status: e.target.value }
                            }))}
                            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>

                          <input
                            type="date"
                            defaultValue={a.follow_up_date || ""}
                            onChange={e => setEditing(prev => ({
                              ...prev,
                              [a.id]: { ...prev[a.id], follow_up_date: e.target.value }
                            }))}
                            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                          />

                          <input
                            type="text"
                            placeholder="Notes..."
                            defaultValue={a.notes || ""}
                            onChange={e => setEditing(prev => ({
                              ...prev,
                              [a.id]: { ...prev[a.id], notes: e.target.value }
                            }))}
                            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-accent"
                          />

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSave(a.id)}
                              className="flex-1 bg-accent hover:bg-accent-hover text-white text-sm font-medium py-2 rounded-lg transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => handleDelete(a.id)}
                              className="px-4 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm font-medium py-2 rounded-lg transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}