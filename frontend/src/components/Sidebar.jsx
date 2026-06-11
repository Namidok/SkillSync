import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  BriefcaseBusiness,
  PlusCircle,
  Sparkles,
} from "lucide-react"

const links = [
  { to: "/",           icon: LayoutDashboard,   label: "Dashboard"       },
  { to: "/applications", icon: BriefcaseBusiness, label: "Applications"  },
  { to: "/add",        icon: PlusCircle,         label: "Add Application" },
  { to: "/extractor",  icon: Sparkles,           label: "NLP Extractor"   },
]

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-card border-r border-border flex flex-col z-10">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-border">
        <span className="text-accent font-bold text-lg tracking-tight">⚡ SkillSync</span>
        <p className="text-muted text-xs mt-0.5">Job Application Tracker</p>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150
              ${isActive
                ? "bg-accent/10 text-accent font-semibold"
                : "text-subtle hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

    </aside>
  )
}