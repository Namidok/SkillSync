import { useMemo } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts"
import StatCard from "../components/StatCard"
import StatusBadge from "../components/StatusBadge"
import useApplications from "../hooks/useApplications"
import EmptyDashboard from "../components/EmptyDashboard"

const STATUS_COLORS = {
  "Not Applied": "#4a5568",
  "Applied":     "#3B82F6",
  "Callback":    "#68d391",
  "Interview":   "#f6ad55",
  "Offer":       "#48bb78",
  "Rejected":    "#fc8181",
}

const APPLIED_REJECTED_COLORS = ["#3B82F6", "#fc8181"]

export default function Dashboard({ user }) {
  const { applications, stats, loading, error } = useApplications()

  const statusData = useMemo(() => {
    const counts = {}
    applications.forEach(a => {
      const s = a.status || "Not Applied"
      counts[s] = (counts[s] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [applications])

  const appliedRejectedData = useMemo(() => {
    const appliedCount = applications.filter(a => a.status && a.status !== "Not Applied" && a.status !== "Rejected").length
    const rejectedCount = applications.filter(a => a.status === "Rejected").length
    return [
      { name: "Applied", value: appliedCount },
      { name: "Rejected", value: rejectedCount },
    ].filter(d => d.value > 0)
  }, [applications])

  const followUps = useMemo(() => {
    return applications.filter(a => {
      if (!a.follow_up_date) return false
      if (["Offer", "Rejected"].includes(a.status)) return false
      return true
    }).sort((a, b) => new Date(a.follow_up_date) - new Date(b.follow_up_date))
  }, [applications])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="bg-red-900/20 border border-red-800 text-red-300 rounded-xl p-4 text-sm">
      {error}
    </div>
  )

  const total     = stats.total || 0
  const callbacks = stats.callbacks || 0

  if (total === 0) return <EmptyDashboard user={user} />

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-subtle text-sm mt-1">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total"        value={total} />
        <StatCard label="Callbacks"    value={callbacks} />
        <StatCard label="Interviews"   value={stats.interviews || 0} />
        <StatCard label="Offers"       value={stats.offers || 0} />
        <StatCard
          label="Callback Rate"
          value={`${total ? ((callbacks / total) * 100).toFixed(1) : 0}%`}
          sub="target: 10–15%"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bar chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted uppercase tracking-widest mb-4">
            Applications by Status
          </p>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={statusData} barSize={32}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#a0aec0", fontSize: 11 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#a0aec0", fontSize: 11 }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip
                  contentStyle={{ background: "#1a1d27", border: "1px solid #2d3748", borderRadius: 8 }}
                  labelStyle={{ color: "#f7fafc" }}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#3B82F6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted text-sm">No data yet.</p>
          )}
        </div>

        {/* Applied vs Rejected pie chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted uppercase tracking-widest mb-4">
            Applied vs Rejected
          </p>
          {appliedRejectedData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={appliedRejectedData}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {appliedRejectedData.map((_, i) => (
                    <Cell key={i} fill={APPLIED_REJECTED_COLORS[i % APPLIED_REJECTED_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#1a1d27", border: "1px solid #2d3748", borderRadius: 8 }}
                  labelStyle={{ color: "#f7fafc" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ color: "#a0aec0", fontSize: 12 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted text-sm">No data yet.</p>
          )}
        </div>
      </div>

      {/* Follow-up alerts */}
      {followUps.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted uppercase tracking-widest mb-4">
            Follow-up Alerts
          </p>
          <div className="space-y-2">
            {followUps.map(a => {
              const isOverdue = new Date(a.follow_up_date) < new Date(new Date().toDateString())
              return (
                <div
                  key={a.id}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 border ${
                    isOverdue ? "bg-red-900/10 border-red-800/30" : "bg-yellow-900/10 border-yellow-800/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isOverdue ? "text-red-400 text-sm" : "text-yellow-400 text-sm"}>⚠</span>
                    <div>
                      <p className="text-white text-sm font-medium">{a.company}</p>
                      <p className="text-muted text-xs">{a.role} · {a.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={a.status} />
                    <span className={isOverdue ? "text-red-300 text-xs" : "text-yellow-300 text-xs"}>
                      {isOverdue ? "Overdue" : "Due"} {a.follow_up_date}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
