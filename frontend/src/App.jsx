import { BrowserRouter, Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Landing from "./pages/Landing"
import Dashboard from "./pages/Dashboard"
import Applications from "./pages/Applications"
import AddApplication from "./pages/AddApplication"
import NLPExtractor from "./pages/NLPExtractor"

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 ml-56 p-8 max-w-6xl">
        <Routes>
          <Route path="/dashboard"    element={<Dashboard />}       />
          <Route path="/applications" element={<Applications />}    />
          <Route path="/add"          element={<AddApplication />}  />
          <Route path="/extractor"    element={<NLPExtractor />}    />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"   element={<Landing />}    />
        <Route path="/*"  element={<AppLayout />}  />
      </Routes>
    </BrowserRouter>
  )
}