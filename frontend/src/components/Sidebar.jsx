import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { LayoutDashboard, BriefcaseBusiness, PlusCircle, Sparkles, LogOut, User, Menu, X } from "lucide-react"
import { supabase } from "../lib/supabase"

const links = [
  { to: "/dashboard",    icon: LayoutDashboard,   label: "Dashboard"       },
  { to: "/applications", icon: BriefcaseBusiness, label: "Applications"    },
  { to: "/add",          icon: PlusCircle,         label: "Add Application" },
  { to: "/extractor",    icon: Sparkles,           label: "Skill Scanner"   },
  { to: "/profile",      icon: User,               label: "Profile"         },
]

export default function Sidebar({ user }) {
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const avatarUrl = user?.user_metadata?.avatar_url
  const name = user?.user_metadata?.full_name || user?.email

  // Close sidebar on route change
  const handleNavClick = () => setOpen(false)

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-card border border-border rounded-lg p-2 text-subtle hover:text-white transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={
        "fixed top-0 left-0 h-screen w-56 bg-card border-r border-border flex flex-col z-50 transition-transform duration-200 " +
        (open ? "translate-x-0" : "-translate-x-full md:translate-x-0")
      }>
        <div className="px-6 py-6 border-b border-border flex items-center justify-between">
          <div>
            <span className="text-accent font-bold text-lg tracking-tight">⚡ SkillSync</span>
            <p className="text-muted text-xs mt-0.5">Job Application Tracker</p>
          </div>
          {/* Close button on mobile */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-subtle hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 " +
                (isActive
                  ? "bg-accent/10 text-accent font-semibold"
                  : "text-subtle hover:text-white hover:bg-white/5")
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full" />
              : <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold">
                  {name?.[0]?.toUpperCase()}
                </div>
            }
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{name}</p>
              <p className="text-muted text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-subtle hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
