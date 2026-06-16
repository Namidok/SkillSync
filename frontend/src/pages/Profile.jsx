import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

const GERMAN_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2", "Native"]
const CITY_OPTIONS = ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Stuttgart", "Düsseldorf", "Leipzig"]

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user
    if (!user) return

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (data) {
      setProfile(data)
      setForm(data)
    } else {
      // Create profile if doesn't exist
      const newProfile = {
        id: user.id,
        full_name: user.user_metadata?.full_name || "",
        email: user.email,
        avatar_url: user.user_metadata?.avatar_url || "",
        target_role: "",
        target_cities: [],
        available_date: "",
        german_level: "A2",
        linkedin_url: "",
        github_url: "",
      }
      await supabase.from("profiles").insert(newProfile)
      setProfile(newProfile)
      setForm(newProfile)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from("profiles")
      .update({
        ...form,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)

    if (!error) {
      setProfile(form)
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setSaving(false)
  }

  const toggleCity = (city) => {
    const current = form.target_cities || []
    if (current.includes(city)) {
      setForm(prev => ({ ...prev, target_cities: current.filter(c => c !== city) }))
    } else {
      setForm(prev => ({ ...prev, target_cities: [...current, city] }))
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-subtle text-sm mt-1">Your job search profile and preferences</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {success && (
        <div className="bg-green-900/20 border border-green-800 text-green-300 rounded-xl px-4 py-3 text-sm">
          Profile updated successfully
        </div>
      )}

      {/* Avatar + basic info */}
      <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-5">
        {profile?.avatar_url
          ? <img src={profile.avatar_url} alt="avatar" className="w-16 h-16 rounded-full" />
          : <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-2xl font-bold">
              {profile?.full_name?.[0]?.toUpperCase()}
            </div>
        }
        <div>
          <p className="text-white font-bold text-lg">{profile?.full_name}</p>
          <p className="text-subtle text-sm">{profile?.email}</p>
          <p className="text-muted text-xs mt-1">Member since {new Date(profile?.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</p>
        </div>
      </div>

      {/* Job search details */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <p className="text-xs text-muted uppercase tracking-widest">Job Search</p>

        <div className="space-y-1.5">
          <label className="text-xs text-muted uppercase tracking-widest">Target Role</label>
          {editing
            ? <input
                type="text"
                value={form.target_role || ""}
                onChange={e => setForm(prev => ({ ...prev, target_role: e.target.value }))}
                placeholder="e.g. AI/ML Engineer"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent"
              />
            : <p className="text-white text-sm">{profile?.target_role || "—"}</p>
          }
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted uppercase tracking-widest">Target Cities</label>
          {editing
            ? <div className="flex flex-wrap gap-2">
                {CITY_OPTIONS.map(city => (
                  <button
                    key={city}
                    onClick={() => toggleCity(city)}
                    className={"text-xs px-3 py-1.5 rounded-lg border transition-colors " +
                      ((form.target_cities || []).includes(city)
                        ? "bg-accent/10 border-accent text-accent"
                        : "bg-surface border-border text-subtle hover:text-white")
                    }
                  >
                    {city}
                  </button>
                ))}
              </div>
            : <p className="text-white text-sm">{profile?.target_cities?.join(", ") || "—"}</p>
          }
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted uppercase tracking-widest">Available From</label>
          {editing
            ? <input
                type="date"
                value={form.available_date || ""}
                onChange={e => setForm(prev => ({ ...prev, available_date: e.target.value }))}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
              />
            : <p className="text-white text-sm">{profile?.available_date || "—"}</p>
          }
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted uppercase tracking-widest">German Level</label>
          {editing
            ? <select
                value={form.german_level || "A2"}
                onChange={e => setForm(prev => ({ ...prev, german_level: e.target.value }))}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
              >
                {GERMAN_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            : <p className="text-white text-sm">{profile?.german_level || "—"}</p>
          }
        </div>
      </div>

      {/* Social links */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <p className="text-xs text-muted uppercase tracking-widest">Links</p>

        <div className="space-y-1.5">
          <label className="text-xs text-muted uppercase tracking-widest">LinkedIn: </label>
          {editing
            ? <input
                type="url"
                value={form.linkedin_url || ""}
                onChange={e => setForm(prev => ({ ...prev, linkedin_url: e.target.value }))}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent"
              />
            : <a href={profile?.linkedin_url} target="_blank" rel="noreferrer" className="text-accent text-sm hover:underline">
                {profile?.linkedin_url || "—"}
              </a>
          }
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted uppercase tracking-widest">GitHub: </label>
          {editing
            ? <input
                type="url"
                value={form.github_url || ""}
                onChange={e => setForm(prev => ({ ...prev, github_url: e.target.value }))}
                placeholder="https://github.com/yourusername"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent"
              />
            : <a href={profile?.github_url} target="_blank" rel="noreferrer" className="text-accent text-sm hover:underline">
                {profile?.github_url || "—"}
              </a>
          }
        </div>
      </div>

      {editing && (
        <div className="flex gap-3">
          <button
            onClick={() => { setEditing(false); setForm(profile) }}
            className="px-6 py-2.5 border border-border text-subtle hover:text-white rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

    </div>
  )
}
