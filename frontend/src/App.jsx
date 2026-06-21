import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { supabase } from "./lib/supabase"
import Sidebar from "./components/Sidebar"
import Auth from "./components/Auth"
import Landing from "./pages/Landing"
import Dashboard from "./pages/Dashboard"
import Applications from "./pages/Applications"
import AddApplication from "./pages/AddApplication"
import NLPExtractor from "./pages/NLPExtractor"
import Profile from "./pages/Profile"

function ProtectedLayout({ user }) {
  if (!user) return <Navigate to="/login" />
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar user={user} />
      <main className="flex-1 md:ml-56 p-8 pt-16 md:pt-8 max-w-6xl">
        <Routes>
          <Route path="/dashboard"    element={<Dashboard user={user} />}          />
          <Route path="/applications" element={<Applications />}    />
          <Route path="/add"          element={<AddApplication />}  />
          <Route path="/extractor"    element={<NLPExtractor />}    />
          <Route path="/profile"      element={<Profile />}         />
          <Route path="/*"            element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"      element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/*"     element={<ProtectedLayout user={user} />} />
      </Routes>
    </BrowserRouter>
  )
}
