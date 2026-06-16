import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { supabase } from "../lib/supabase"

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) return null
  return { Authorization: `Bearer ${session.access_token}` }
}

export default function useApplications() {
  const [applications, setApplications] = useState([])
  const [stats, setStats]               = useState({})
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const headers = await getAuthHeader()
      if (!headers) {
        setError("Not authenticated")
        return
      }
      const [appsRes, statsRes] = await Promise.all([
        axios.get("/api/applications", { headers }),
        axios.get("/api/stats", { headers }),
      ])
      setApplications(appsRes.data)
      setStats(statsRes.data)
    } catch (err) {
      setError("Cannot reach API — is FastAPI running on port 8000?")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Wait for session to be ready after OAuth redirect
    const timer = setTimeout(() => fetchAll(), 500)
    return () => clearTimeout(timer)
  }, [fetchAll])

  const updateApplication = async (id, data) => {
    const headers = await getAuthHeader()
    await axios.patch(`/api/applications/${id}`, data, { headers })
    fetchAll()
  }

  const deleteApplication = async (id) => {
    const headers = await getAuthHeader()
    await axios.delete(`/api/applications/${id}`, { headers })
    fetchAll()
  }

  const addApplication = async (data) => {
    const headers = await getAuthHeader()
    const res = await axios.post("/api/applications", data, { headers })
    fetchAll()
    return res.data
  }

  const extractSkills = async (text) => {
    const res = await axios.post("/api/extract-skills", { text })
    return res.data.skills || []
  }

  const bulkLoad = async (companies) => {
    const headers = await getAuthHeader()
    const existing = new Set(applications.map(a => a.company))
    for (const [company, role, city, tier] of companies) {
      if (!existing.has(company)) {
        await axios.post("/api/applications", {
          company, role, city, tier,
          job_description: "", applied_date: "",
        }, { headers })
      }
    }
    fetchAll()
  }

  return {
    applications,
    stats,
    loading,
    error,
    fetchAll,
    updateApplication,
    deleteApplication,
    addApplication,
    extractSkills,
    bulkLoad,
  }
}
