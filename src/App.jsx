import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/navbar"
import Sidebar from "./components/Sidebar"
import LoginPage from "./pages/LoginPage"
import Dashboard from "./pages/Dashboard"
import Installations from "./pages/Installations"
import MaintenancePage from "./pages/MaintenancePage"
import Billing from "./pages/Billing"
import FinancialAnalytics from "./pages/FinancialAnalytics"

function App() {
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
                <Navbar />
                <div className="flex">
                  <Sidebar />
                  <main className="flex-1 p-6">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/installations" element={<Installations />} />
                      <Route path="/maintenance" element={<MaintenancePage />} />
                      <Route path="/billing" element={<Billing />} />
                      <Route path="/financial" element={<FinancialAnalytics />} />
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
