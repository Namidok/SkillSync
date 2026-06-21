import { useNavigate } from "react-router-dom"

const FEATURES = [
  {
    icon: "🎯",
    title: "Track Every Application",
    desc: "One place for all your applications. Status, follow-ups, notes — nothing falls through the cracks.",
  },
  {
    icon: "⚡",
    title: "Skill Scanner",
    desc: "Paste any job description and instantly see what skills are required and where your gaps are.",
  },
  {
    icon: "📊",
    title: "Pipeline Analytics",
    desc: "Live dashboard showing your callback rate, interview pipeline and tier breakdown at a glance.",
  },
  {
    icon: "🔍",
    title: "Find Contacts",
    desc: "One click to search LinkedIn for the right person at any company in your pipeline.",
  },
]

const STEPS = [
  {
    number: "01",
    title: "Add your applications",
    desc: "Add roles one by one. Paste the job description and skills are extracted automatically.",
  },
  {
    number: "02",
    title: "Track your pipeline",
    desc: "Update status as you hear back. Set follow-up reminders so you never go cold on a role.",
  },
  {
    number: "03",
    title: "Analyse your gaps",
    desc: "See exactly which skills recruiters are asking for and what you need to build next.",
  },
]

const MOCK_APPS = [
  { co: "Acme Corp",    role: "ML Engineer",      tier: "🔥 Tier 1", status: "Callback",  color: "bg-green-500/20 text-green-300 border border-green-500/30" },
  { co: "Tech GmbH",   role: "Data Engineer",     tier: "🔥 Tier 1", status: "Applied",   color: "bg-blue-500/20 text-blue-300 border border-blue-500/30" },
  { co: "StartupX",    role: "Backend Engineer",  tier: "⚡ Tier 2", status: "Interview", color: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10 max-w-6xl mx-auto">
        <span className="text-white font-bold text-lg tracking-tight">
          ⚡ <span className="text-blue-400">Skill</span>Sync
        </span>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          Get Started →
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 pt-24 pb-20 text-center">

        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Free · No credit card required
        </div>

        <h1 className="text-6xl md:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
          Stop guessing.
          <br />
          <span className="text-blue-400" style={{ textShadow: "0 0 60px rgba(59,130,246,0.5)" }}>
            Start tracking.
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
          SkillSync is an AI-powered job tracker that extracts skills from job descriptions,
          analyses your gaps, and keeps your entire pipeline organised in one place.
        </p>

        <div className="flex items-center justify-center gap-4 mb-20 flex-wrap">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:scale-105 text-sm shadow-lg shadow-blue-500/25"
          >
            Start Tracking — it's free
          </button>
          <button
            onClick={() => navigate("/login")}
            className="border border-white/20 hover:border-white/40 text-white font-medium px-7 py-3.5 rounded-xl transition-colors text-sm"
          >
            Try Skill Scanner
          </button>
        </div>

        {/* Mock dashboard */}
        <div className="bg-[#111318] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 max-w-2xl mx-auto text-left">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="text-white/30 text-xs ml-3 font-mono">skillsync · dashboard</span>
          </div>

          <div className="grid grid-cols-3 gap-px bg-white/5 border-b border-white/10">
            {[["TOTAL", "24"], ["CALLBACKS", "4"], ["CALLBACK RATE", "16.7%"]].map(([label, val]) => (
              <div key={label} className="bg-[#111318] px-5 py-4">
                <p className="text-white/40 text-xs tracking-widest mb-1">{label}</p>
                <p className="text-white text-2xl font-bold">{val}</p>
              </div>
            ))}
          </div>

          <div className="divide-y divide-white/5">
            {MOCK_APPS.map(({ co, role, tier, status, color }) => (
              <div key={co} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div>
                  <p className="text-white text-sm font-semibold">{co}</p>
                  <p className="text-white/40 text-xs mt-0.5">{role}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/30 text-xs">{tier}</span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${color}`}>
                    {status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 py-20 border-t border-white/10">
        <p className="text-xs text-white/30 uppercase tracking-widest text-center mb-12 font-semibold">
          Everything you need to run a structured job search
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all"
            >
              <span className="text-2xl mb-3 block">{icon}</span>
              <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-8 py-20 border-t border-white/10">
        <p className="text-xs text-white/30 uppercase tracking-widest text-center mb-16 font-semibold">
          How it works
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {STEPS.map(({ number, title, desc }) => (
            <div key={number}>
              <span className="text-6xl font-black text-blue-500/20 mb-3 block">{number}</span>
              <h3 className="text-white font-bold mb-2">{title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-8 py-24 border-t border-white/10 text-center">
        <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
          Ready to take control?
        </h2>
        <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto">
          Sign in with Google and start tracking in under 60 seconds.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-10 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
        >
          Start Tracking →
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-6 max-w-6xl mx-auto flex items-center justify-between">
        <span className="text-white/60 font-bold text-sm">
          ⚡ <span className="text-blue-400">Skill</span>Sync
        </span>
        <span className="text-white/20 text-xs">Built with React · FastAPI · AWS</span>
      </footer>

    </div>
  )
}
