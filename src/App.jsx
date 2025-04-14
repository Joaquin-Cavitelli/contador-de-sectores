"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import SectorPage from "./pages/SectorPage"
import AdminPage from "./pages/AdminPage"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("adminAuth")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="">
          {" "}
          {/* Add padding for fixed header */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sector/:id" element={<SectorPage />} />
            <Route
              path="/admin"
              element={<AdminPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
