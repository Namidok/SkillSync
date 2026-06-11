const STATUS_STYLES = {
  "Not Applied": "bg-gray-800 text-gray-400",
  "Applied":     "bg-blue-900/50 text-blue-300",
  "Callback":    "bg-green-900/50 text-green-300",
  "Interview":   "bg-yellow-900/50 text-yellow-300",
  "Offer":       "bg-emerald-900/50 text-emerald-300",
  "Rejected":    "bg-red-900/50 text-red-400",
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES["Not Applied"]
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${style}`}>
      {status}
    </span>
  )
}