import { useState } from "react"
import { Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import StatusBadge from "../components/StatusBadge"
import SkillTag from "../components/SkillTag"
import useApplications from "../hooks/useApplications"
import EmptyApplications from "../components/EmptyApplications"

const STATUS_OPTIONS = ["Not Applied", "Applied", "Callback", "Interview", "Offer", "Rejected"]
const PAGE_SIZE = 10

function ConfirmModal({ type, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1a1d27] border border-[#2d3748] rounded-2xl p-6 w-full max-w-sm mx-4">
        <h3 className="text-white font-bold text-lg mb-2">
          {type === "all" ? "Delete All Applications?" : "Delete Application?"}
        </h3>
        <p className="text-subtle text-sm mb-6">
          {type === "all"
            ? "This will permanently remove all your applications. This cannot be undone."
            : "This will permanently remove this application. This cannot be undone."}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-border text-subtle hover:text-white rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition-colors"
          >
            {type === "all" ? "Delete All" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Applications() {
  const { applications, loading, updateApplication, deleteApplication, deleteAll } = useApplications()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [expanded, setExpanded] = useState(null)
  const [editing, setEditing] = useState({})
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  const [page, setPage] = useState(1)

  const today = new Date().toISOString().split("T")[0]

  const filtered = applications.filter(a => {
    const matchSearch = (
      a.company.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase())
    )
    const matchStatus = statusFilter === "All" || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const sorted = [...filtered].sort((a, b) => a.company.localeCompare(b.company))
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSave = async (id) => {
    await updateApplication(id, editing[id] || {})
    setExpanded(null)
  }

  const handleConfirmDelete = async () => {
    if (confirmDelete === "single") {
      await deleteApplication(deleteTargetId)
      setExpanded(null)
      await new Promise(r => setTimeout(r, 100))
    } else if (confirmDelete === "all") {
      await deleteAll(applications)
    }
    setConfirmDelete(null)
    setDeleteTargetId(null)
  }

  if (!loading && applications.length === 0) return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Applications</h1>
        <p className="text-subtle text-sm mt-1">Track every company you apply to</p>
      </div>
      <div className="bg-card border border-border rounded-xl">
        <EmptyApplications />
      </div>
    </div>
  )

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Applications</h1>
          <p className="text-subtle text-sm mt-1">
            Showing <span className="text-white font-medium">{filtered.length}</span> of {applications.length}
          </p>
        </div>
        {applications.length > 0 && (
          <button
            onClick={() => setConfirmDelete("all")}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm font-medium rounded-lg transition-colors"
          >
            <Trash2 size={14} />
            Delete All
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search company, role, city..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-subtle focus:outline-none focus:border-accent"
        >
          <option value="All">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs text-muted uppercase tracking-widest px-5 py-3">Company</th>
              <th className="text-left text-xs text-muted uppercase tracking-widest px-5 py-3">Role</th>
              <th className="text-left text-xs text-muted uppercase tracking-widest px-5 py-3 hidden md:table-cell">City</th>
              <th className="text-left text-xs text-muted uppercase tracking-widest px-5 py-3">Status</th>
              <th className="text-left text-xs text-muted uppercase tracking-widest px-5 py-3 hidden lg:table-cell">Applied</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted py-12 text-sm">
                  No applications match your filters.
                </td>
              </tr>
            )}
            {paginated.map(a => (
              <>
                <tr
                  key={a.id}
                  onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                  className="border-b border-border/50 hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium text-white">{a.company}</td>
                  <td className="px-5 py-3.5 text-subtle">{a.role}</td>
                  <td className="px-5 py-3.5 text-subtle hidden md:table-cell">{a.city}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={a.status} /></td>
                  <td className="px-5 py-3.5 text-muted text-xs hidden lg:table-cell">{a.applied_date || "—"}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-muted text-xs">{expanded === a.id ? "▲" : "▼"}</span>
                  </td>
                </tr>

                {expanded === a.id && (
                  <tr key={`${a.id}-expanded`} className="bg-surface">
                    <td colSpan={6} className="px-5 py-5">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {a.extracted_skills?.length > 0 && (
                            <div>
                              <p className="text-xs text-muted uppercase tracking-widest mb-2">Extracted Skills</p>
                              <div className="flex flex-wrap gap-1.5">
                                {a.extracted_skills.map(s => <SkillTag key={s} skill={s} />)}
                              </div>
                            </div>
                          )}
                          {a.cover_letter_notes && (
                            <div>
                              <p className="text-xs text-muted uppercase tracking-widest mb-1">Cover Letter Notes</p>
                              <p className="text-subtle text-sm">{a.cover_letter_notes}</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <p className="text-xs text-muted uppercase tracking-widest">Update</p>
                          <select
                            defaultValue={a.status}
                            onChange={e => setEditing(prev => ({
                              ...prev,
                              [a.id]: { ...prev[a.id], status: e.target.value }
                            }))}
                            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                          >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>

                          <input
                            type="date"
                            defaultValue={a.follow_up_date || today}
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
                              onClick={() => { setDeleteTargetId(a.id); setConfirmDelete("single") }}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-border">
            <p className="text-xs text-muted">
              Page <span className="text-white font-medium">{page}</span> of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg text-xs text-subtle hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg text-xs text-subtle hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {confirmDelete && (
        <ConfirmModal
          type={confirmDelete}
          onConfirm={handleConfirmDelete}
          onCancel={() => { setConfirmDelete(null); setDeleteTargetId(null) }}
        />
      )}

    </div>
  )
}
