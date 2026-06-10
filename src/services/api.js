/**
 * API Service Layer — Real API calls to Express backend
 */

const BASE_URL = "http://localhost:3001/api";

function getHeaders() {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("smyid_token");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: getHeaders(),
    ...options,
  });
  if (res.status === 401) {
    localStorage.removeItem("smyid_token");
    localStorage.removeItem("smyid_user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ---- Auth ----
export const loginAPI = async (username, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) return { success: false, message: data.message || "Login gagal" };
  return { success: true, token: data.token, user: data.user };
};

// ---- Dashboard ----
export const fetchDashboardStats = () => apiFetch("/dashboard/stats");

// ---- Routers ----
export const fetchRouters = () => apiFetch("/routers");
export const fetchRouterDetail = (id) => apiFetch(`/routers/${id}`);

// ---- Clients ----
export const fetchClients = () => apiFetch("/clients");

// ---- Bandwidth ----
export const fetchBandwidthHistory = () => apiFetch("/bandwidth/history");

// ---- Alerts ----
export const fetchAlerts = () => apiFetch("/alerts");
export const fetchAlertStats = () => apiFetch("/alerts/stats");
export const acknowledgeAlert = (id) =>
  apiFetch(`/alerts/${id}/ack`, { method: "PUT" });

// ---- Billing ----
export const fetchInvoices = () => apiFetch("/billing");
export const fetchBillingStats = () => apiFetch("/billing/stats");

// ---- Financial ----
export const fetchRevenue = () => apiFetch("/financial/revenue");
export const fetchRevenueByPlan = () => apiFetch("/financial/by-plan");
export const fetchTopClients = () => apiFetch("/financial/top-clients");
export const fetchFinancialStats = () => apiFetch("/financial/stats");

// ---- SMY.ID ----
export const fetchSMYOverview = () => apiFetch("/smyid/overview");
export const fetchSiteSummary = () => apiFetch("/smyid/site-summary");
export const fetchMonthlyData = (category) => apiFetch(`/smyid/monthly/${category}`);

// ---- Installations ----
export const fetchInstallations = () => apiFetch("/installations");

// ---- Maintenance ----
export const fetchMaintenanceLogs = () => apiFetch("/maintenance");
