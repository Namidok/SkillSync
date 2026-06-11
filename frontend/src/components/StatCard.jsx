export default function StatCard({ label, value, sub }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-1">
      <span className="text-xs text-muted uppercase tracking-widest">{label}</span>
      <span className="text-3xl font-bold text-white">{value}</span>
      {sub && <span className="text-xs text-subtle">{sub}</span>}
    </div>
  )
}