import { useNavigate } from "react-router-dom"
import { PlusCircle, Sparkles, Target, BarChart3 } from "lucide-react"

export default function EmptyDashboard({ user }) {
  const navigate = useNavigate()
  const name = user?.user_metadata?.full_name?.split(" ")[0] || "there"

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Hey {name} 👋</h1>
        <p className="text-subtle text-sm mt-1">Let's start tracking your job search.</p>
      </div>

      {/* Welcome card */}
      <div className="bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target size={32} className="text-accent" />
        </div>
        <h2 className="text-white font-bold text-xl mb-2">Your job search starts here</h2>
        <p className="text-subtle text-sm max-w-md mx-auto mb-6 leading-relaxed">
          Track every application, extract skills from job descriptions, and never miss a follow-up. Add your first company to get started.
        </p>
        <button
          onClick={() => navigate("/add")}
          className="bg-accent hover:bg-accent-hover text-white font-bold px-8 py-3 rounded-xl transition-all hover:scale-105 text-sm"
        >
          Add your first application →
        </button>
      </div>

      {/* 3 steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: PlusCircle,
            step: "01",
            title: "Add companies",
            desc: "Add companies you want to apply to. Set tiers to prioritise your targets.",
            action: () => navigate("/add"),
            cta: "Add Application"
          },
          {
            icon: Sparkles,
            step: "02",
            title: "Extract skills",
            desc: "Paste any job description and instantly extract the required tech skills.",
            action: () => navigate("/extractor"),
            cta: "Try NLP Extractor"
          },
          {
            icon: BarChart3,
            step: "03",
            title: "Track progress",
            desc: "Update statuses as you get callbacks and interviews. Your pipeline builds automatically.",
            action: null,
            cta: null
          },
        ].map(({ icon: Icon, step, title, desc, action, cta }) => (
          <div key={step} className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-accent font-black text-lg">{step}</span>
              <Icon size={18} className="text-accent" />
            </div>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-subtle text-xs leading-relaxed">{desc}</p>
            {cta && action && (
              <button
                onClick={action}
                className="text-accent text-xs font-semibold hover:underline"
              >
                {cta} →
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Quick tip */}

    </div>
  )
}
