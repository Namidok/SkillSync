import { useState, useEffect, useCallback } from "react"
import axios from "axios"

// Generate or retrieve a unique session ID for this browser
function getSessionId() {
  let sessionId = localStorage.getItem("skillsync_session_id")
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem("skillsync_session_id", sessionId)
  }
  return sessionId
}

const SESSION_ID = getSessionId()

// Attach session ID to every request automatically
axios.defaults.headers.common["x-session-id"] = SESSION_ID
axios.defaults.baseURL = window.location.origin

export default function useApplications() {
  const [applications, setApplications] = useState([])
  const [stats, setStats]               = useState({})
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      const [appsRes, statsRes] = await Promise.all([
        axios.get("/api/applications"),
        axios.get("/api/stats"),
      ])
      setApplications(appsRes.data)
      setStats(statsRes.data)
    } catch (err) {
      setError("Cannot reach API — is FastAPI running on port 8000?")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const updateApplication = async (id, data) => {
    await axios.patch(`/api/applications/${id}`, data)
    fetchAll()
  }

  const deleteApplication = async (id) => {
    await axios.delete(`/api/applications/${id}`)
    fetchAll()
  }

  const addApplication = async (data) => {
    const res = await axios.post("/api/applications", data)
    fetchAll()
    return res.data
  }

  const extractSkills = async (text) => {
    const res = await axios.post("/api/extract-skills", { text })
    return res.data.skills || []
  }

  const bulkLoad = async (companies) => {
    const existing = new Set(applications.map(a => a.company))
    for (const [company, role, city, tier] of companies) {
      if (!existing.has(company)) {
        await axios.post("/api/applications", {
          company, role, city, tier,
          job_description: "", applied_date: "",
        })
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
    sessionId: SESSION_ID,
  }
}