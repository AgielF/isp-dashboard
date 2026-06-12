import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import RoleRoute from "./components/RoleRoute"
import Navbar from "./components/navbar"
import Sidebar from "./components/Sidebar"
import LoginPage from "./pages/LoginPage"
import Dashboard from "./pages/Dashboard"
import RoutersPage from "./pages/RoutersPage"
import ClientsPage from "./pages/ClientsPage"
import Installations from "./pages/Installations"
import MaintenancePage from "./pages/MaintenancePage"
import Billing from "./pages/Billing"
import FinancialAnalytics from "./pages/FinancialAnalytics"
import WeatherAnalytics from "./pages/WeatherAnalytics"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-slate-100">
                <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
                <div className="flex">
                  <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                  <main className="flex-1 p-4 sm:p-6 min-w-0">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/routers" element={<RoleRoute module="routers"><RoutersPage /></RoleRoute>} />
                      <Route path="/clients" element={<RoleRoute module="clients"><ClientsPage /></RoleRoute>} />
                      <Route path="/installations" element={<RoleRoute module="installations"><Installations /></RoleRoute>} />
                      <Route path="/maintenance" element={<RoleRoute module="maintenance"><MaintenancePage /></RoleRoute>} />
                      <Route path="/billing" element={<RoleRoute module="billing"><Billing /></RoleRoute>} />
                      <Route path="/financial" element={<RoleRoute module="financial"><FinancialAnalytics /></RoleRoute>} />
                      <Route path="/weather" element={<RoleRoute module="financial"><WeatherAnalytics /></RoleRoute>} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
