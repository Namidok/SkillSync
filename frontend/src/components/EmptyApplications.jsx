import { useNavigate } from "react-router-dom"
import { PlusCircle, Upload } from "lucide-react"

export default function EmptyApplications() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
      <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
        <Upload size={28} className="text-accent" />
      </div>
      <div>
        <h2 className="text-white font-bold text-lg mb-2">No applications yet</h2>
        <p className="text-subtle text-sm max-w-sm leading-relaxed">
          Start tracking your job search by adding your first application. Add companies, track statuses, and never miss a follow-up.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/add")}
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
        >
          <PlusCircle size={16} />
          Add Application
        </button>

      </div>
    </div>
  )
}
